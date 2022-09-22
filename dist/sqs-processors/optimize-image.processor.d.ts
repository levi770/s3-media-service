import { Job, DoneCallback } from 'bull';
declare function imageProcessor(job: Job, doneCallback: DoneCallback): Promise<void>;
export default imageProcessor;
