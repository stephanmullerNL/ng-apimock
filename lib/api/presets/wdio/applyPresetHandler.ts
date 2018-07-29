import ApplyPresetHandler from '../applyPresetHandler';
import helper from '../../helper';
import Preset from '../../../../tasks/preset';
import WdioResetMocksToDefaultsHandler from '../../mocks/wdio/resetMocksToDefaultsHandler';
import WdioUpdateMockHandler from '../../mocks/wdio/updateMockHandler';
import Registry from '../../../registry';

/** Handler that takes care of updating the mock configuration for wdio. */
class WdioApplyPresetHandler extends ApplyPresetHandler {

    private resetDefaultsHandler: WdioResetMocksToDefaultsHandler = new WdioResetMocksToDefaultsHandler();
    private updateMockHandler: WdioUpdateMockHandler = new WdioUpdateMockHandler();

    /** @inheritDoc */
    handlePresetSelection(registry: Registry, preset: Preset, ngApimockId: string): void {
        helper.wdio.addSessionIfNonExisting(registry, ngApimockId);
        this.resetDefaultsHandler.resetToDefaults(registry, ngApimockId);

        for (const identifier in preset.scenarios) {
            if (preset.scenarios.hasOwnProperty(identifier)) {
                this.updateMockHandler.handleScenarioSelection(registry, identifier, preset.scenarios[identifier], ngApimockId)
            }
        }
    }
}

export default WdioApplyPresetHandler;
