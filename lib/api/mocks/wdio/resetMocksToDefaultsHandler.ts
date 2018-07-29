import ResetMocksToDefaultsHandler from '../resetMocksToDefaultsHandler';
import helper from '../../helper';
import Registry from '../../../registry';

/** Handler that takes care of resetting the mocks to defaults for wdio. */
class WdioResetMocksToDefaultsHandler extends ResetMocksToDefaultsHandler {
    /** @inheritDoc */
    resetToDefaults(registry: Registry, ngApimockId: string): void {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        registry.sessions[ngApimockId].selections = JSON.parse(JSON.stringify(registry.defaults));
    }

    /** @inheritDoc */
    getSelections(registry: Registry, ngApimockId: string): {} {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        return registry.sessions[ngApimockId].selections;
    }
}

export default WdioResetMocksToDefaultsHandler;
