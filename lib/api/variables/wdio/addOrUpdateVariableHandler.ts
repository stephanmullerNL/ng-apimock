import helper from '../../helper';
import Registry from '../../../registry';
import AddOrUpdateVariableHandler from '../addOrUpdateVariableHandler';

/** Handler that takes care of adding or updating variables for wdio. */
class WdioAddOrUpdateVariableHandler extends AddOrUpdateVariableHandler {
    /** @inheritDoc */
    handleAddOrUpdateVariable(registry: Registry, key: string, value: string, ngApimockId?: string): void {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        registry.sessions[ngApimockId].variables[key] = value;
    }
}

export default WdioAddOrUpdateVariableHandler;
