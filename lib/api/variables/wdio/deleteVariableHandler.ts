import helper from '../../helper';
import DeleteVariablesHandler from '../deleteVariableHandler';
import Registry from '../../../registry';

/** Handler that takes care of deleting a variable for wdio. */
class WdioDeleteVariableHandler extends DeleteVariablesHandler {
    /** @inheritDoc */
    deleteVariable(registry: Registry, variable: string, ngApimockId?: string): void {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        delete registry.sessions[ngApimockId].variables[variable];
    }
}

export default WdioDeleteVariableHandler;
