# S3-Media-Service

## Requirements

- Git
- NodeJs
- Postgres
- Redis
- Optional: Docker

You need to create new Postgres database for microservice and setup Redis pub/sub host, or run `docker-compose up` to create a working environment from Docker containers

## Installation

1. Clone this repo:

```bash
$ git clone https://github.com/Exclusible/s3-media-svc.git`
```

2. Create .env file in project root directory containing the values of following fields:

```env
# AWS settings
AWS_REGION=
S3_BUCKET_NAME=
SQS_QUEUE_NAME=
SQS_QUEUE_URL=
AWS_ACCOUNT=
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=

# Postgres settings
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# Redis setings
REDIS_HOST=
REDIS_PORT=
```

3. Install modules:

```bash
$ npm install
```

4. Run service:

```bash
$ npm run start:prod
```

## Testing client

i created a mini application for testing with a connection to a microservice using Redis pub/sub and a simple API for client requests and emulating file uploads by the client.

1. Unzip testing-client.zip to other directory and cd in this directory
2. Run testing-client:

```bash
$ npm run start:prod
```

3. import s3-media-svc-tests.postman_collection.json file into your Postman app with user request examples.

## Description

The service allows you to upload any files to the s3 cloud storage. when uploading images, you can specify optimization parameters in the upload request, then after uploading the original file, an additional optimized file will be created, so both original and optimized files will be stored in the cloud storage. archives or 3D objects will be unloaded but will not be optimized.

The system consists of five main modules:

- The root module responsible for receiving messages and routing requests;
- S3 module that generates links for uploading files on the client side;
- SQS module is responsible for receiving download status notifications from the s3 repository;
- A database module that creates records for each uploaded file and allows you to track the status;
- A file processing module that runs in a separate worker thread and that provides files conversion and resizing.

## Working process

1. User sends a request to the backend and can specify various options for optimizing the file and backend sends request to microservice;
2. The microservice creates an entry in the database with the client's request parameters, then generates a file upload link and returns it to the backend, and the backend returns the link to the client;
3. The client application uploads the file directly to s3 using a link received from the backend which is valid for 10 minutes;
4. Upon completion of the file upload, s3 service will send a notification of successful upload to the SQS queue;
5. The microservice listens to messages from the SQS queue and, when a message is received, it requests a file status record from the database and checks the file parameters, if the parameters indicate that optimization is required, then the microservice creates a task in the Redis optimization queue;
6. The optimization module receives the task, optimizes the file according to the specified parameters, then uploads the optimized file to s3 and creates a record about the new file in the database and establishes a relationship between the original and the optimized file;
7. The database module allows to get all file status records, including optimized child files or only original ones, and get a single file by ID or key;

## Data transfer objects

### Generate a new file upload link request

```
{
  // file mimetype, required
  fileType: string;

  // file name with extension, required
  originalname: string;

  // "true" or "false", if "true" is set, file will be optimized, optional
  optimize?: string;

  // number from 1 to 100, optional
  quality?: string;

  // "true" or "false", if "true" is set, size value will be required and file will be resized, optional
  resize?: string;

  // two comma separated numbers (width,height), optional
  size?: string;
}
```

Responce:

```
{
  // 200 = Ok; 400 = Bad request
  status: number;

  // Url or error message
  message: string;
}
```

### Get all objects from database request

```
{
  // Pagination parameter, optional
  page?: string;

  // Pagination parameter, optional
  limit?: string;

  // "ASC" or "DESC" order, optional
  order?: string;

  // specified order field, optional
  order_by?: string;

  // "true" or "false", if "true" is set, result objects will include child objects, optional
  include_child?: string;
}
```

Responce:

```
{
  // array of objects
  rows: File[];

  // total objects count
  count: number;
}
```

### Get one object from database request

```
{
  // object id in database
  id?: string;

  // object key in s3
  key?: string;

  // "true" or "false", if "true" is set, result objects will include child objects, optional
  include_child?: string;
}
```

Responce:

```
{
  // uuid, primary key
  id: string;

  // key in s3 service
  key: string;

  // "initial" | "uploaded" | "failed" | "deleted"
  status: string;

  // "original" | "optimized"
  type: string;

  // object with "Generate a new file upload link request" params
  params: object;

  // if "true" is set in "include_child" parameter, result object will include child objects
  processed_files: File[];
}
```

if the value for "id" or "key" is omitted, the request will return an error

```
{
// 400 = Bad request
status: number;

// error message
message: string;
}
```

if an object with the requested key or id is not found, the request will return an empty object
