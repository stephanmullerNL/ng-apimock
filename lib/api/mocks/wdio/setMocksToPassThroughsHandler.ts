import SetMocksToPassThroughsHandler from '../setMocksToPassThroughsHandler';
import helper from '../../helper';
import Registry from '../../../registry';

/** Handler that takes care of setting the mocks to passThroughs for wdio. */
class WdioSetMocksToPassThroughsHandler extends SetMocksToPassThroughsHandler {
    /** @inheritDoc */
    setToPassThroughs(registry: Registry, ngApimockId?: string): void {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        registry.sessions[ngApimockId].selections = {};
    }

    /** @inheritDoc */
    getSelections(registry: Registry, ngApimockId: string): {} {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        return registry.sessions[ngApimockId].selections;
    }
}

export default WdioSetMocksToPassThroughsHandler;
