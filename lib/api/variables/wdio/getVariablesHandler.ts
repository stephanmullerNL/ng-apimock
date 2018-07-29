import helper from '../../helper';
import GetVariablesHandler from '../getVariablesHandler';
import Registry from '../../../registry';

/** Handler that takes care of getting all the variables for wdio. */
class WdioGetVariablesHandler extends GetVariablesHandler {
    /** @inheritDoc */
    getVariables(registry: Registry, ngApimockId?: string): {} {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        return registry.sessions[ngApimockId].variables;
    }
}

export default WdioGetVariablesHandler;
