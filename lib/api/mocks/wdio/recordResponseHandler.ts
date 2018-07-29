import RecordResponseHandler from '../recordResponseHandler';
import Registry from '../../../registry';

/** Handler that takes care of recording the response for wdio. */
class WdioRecordResponseHandler extends RecordResponseHandler {
    /** @inheritDoc */
    record(registry: Registry, ngApimockId?: string): void {
        // no recording possible for wdio
    }
}

export default WdioRecordResponseHandler;
