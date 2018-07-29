import helper from '../../helper';
import GetMocksHandler from '../getMocksHandler';
import Registry from '../../../registry';

/** Handler that takes care of getting all the mocks for wdio. */
class WdioGetMocksHandler extends GetMocksHandler {
    /** @inheritDoc */
    getSelections(registry: Registry, ngApimockId?: string): { [key: string]: string } {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        return registry.sessions[ngApimockId].selections;
    }

    /** @inheritDoc */
    getEchos(registry: Registry, ngApimockId?: string): { [key: string]: boolean } {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        return registry.sessions[ngApimockId].echos;
    }

    /** @inheritDoc */
    getDelays(registry: Registry, ngApimockId?: string): { [key: string]: number } {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        return registry.sessions[ngApimockId].delays;
    }
}

export default WdioGetMocksHandler;
