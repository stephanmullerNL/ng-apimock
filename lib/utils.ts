import Mock from '../tasks/mock';
import Preset from '../tasks/preset';
import * as http from 'http';
import {httpMethods} from './http';
import GetPresetsHandler from './api/presets/getPresetsHandler';
import WdioAddOrUpdateVariableHandler from './api/variables/wdio/addOrUpdateVariableHandler';
import WdioApplyPresetHandler from './api/presets/wdio/applyPresetHandler';
import WdioDeleteVariableHandler from './api/variables/wdio/deleteVariableHandler';
import WdioGetMocksHandler from './api/mocks/wdio/getMocksHandler';
import WdioGetVariablesHandler from './api/variables/wdio/getVariablesHandler';
import WdioNgApimockHandler from './wdio/ngApimockHandler';
import WdioRecordResponseHandler from './api/mocks/wdio/recordResponseHandler';
import WdioResetMocksToDefaultsHandler from './api/mocks/wdio/resetMocksToDefaultsHandler';
import WdioSetMocksToPassThroughsHandler from './api/mocks/wdio/setMocksToPassThroughsHandler';
import WdioUpdateMockHandler from './api/mocks/wdio/updateMockHandler';
import Registry from './registry';
import RuntimeAddOrUpdateVariableHandler from './api/variables/runtime/addOrUpdateVariableHandler';
import RuntimeApplyPresetHandler from './api/presets/runtime/applyPresetHandler';
import RuntimeDeleteVariableHandler from './api/variables/runtime/deleteVariableHandler';
import RuntimeGetMocksHandler from './api/mocks/runtime/getMocksHandler';
import RuntimeGetVariablesHandler from './api/variables/runtime/getVariablesHandler';
import RuntimeNgApimockHandler from './runtime/ngApimockHandler';
import RuntimeRecordResponseHandler from './api/mocks/runtime/recordResponseHandler';
import RuntimeResetMocksToDefaultsHandler from './api/mocks/runtime/resetMocksToDefaultsHandler';
import RuntimeSetMocksToPassThroughsHandler from './api/mocks/runtime/setMocksToPassThroughsHandler';
import RuntimeUpdateMockHandler from './api/mocks/runtime/updateMockHandler';
import DELETE = httpMethods.DELETE;
import PUT = httpMethods.PUT;
import GET = httpMethods.GET;

(function () {
    'use strict';

    (module).exports = {
        ngApimockRequest: ngApimockRequest,
        registerMocks: registerMocks,
        registerPresets: registerPresets,
        updateMock: updateMock
    };

    const registry: Registry = new Registry(),
        handlers = {
            wdio: {
                updateMockHandler: new WdioUpdateMockHandler(),
                getMocksHandler: new WdioGetMocksHandler(),
                resetMocksToDefaultsHandler: new WdioResetMocksToDefaultsHandler(),
                setMocksToPassThroughsHandler: new WdioSetMocksToPassThroughsHandler(),
                recordResponseHandler: new WdioRecordResponseHandler(),
                getPresetsHandler: new GetPresetsHandler(),
                applyPresetHandler: new WdioApplyPresetHandler(),
                addOrUpdateVariableHandler: new WdioAddOrUpdateVariableHandler(),
                getVariablesHandler: new WdioGetVariablesHandler(),
                deleteVariableHandler: new WdioDeleteVariableHandler(),
                ngApimockHandler: new WdioNgApimockHandler()
            },
            runtime: {
                updateMockHandler: new RuntimeUpdateMockHandler(),
                getMocksHandler: new RuntimeGetMocksHandler(),
                resetMocksToDefaultsHandler: new RuntimeResetMocksToDefaultsHandler(),
                setMocksToPassThroughsHandler: new RuntimeSetMocksToPassThroughsHandler(),
                recordResponseHandler: new RuntimeRecordResponseHandler(),
                getPresetsHandler: new GetPresetsHandler(),
                applyPresetHandler: new RuntimeApplyPresetHandler(),
                addOrUpdateVariableHandler: new RuntimeAddOrUpdateVariableHandler(),
                getVariablesHandler: new RuntimeGetVariablesHandler(),
                deleteVariableHandler: new RuntimeDeleteVariableHandler(),
                ngApimockHandler: new RuntimeNgApimockHandler()
            }
        };

    /**
     * The connect middleware for handeling the mocking
     * @param request The http request.
     * @param response The http response.
     * @param next The next middleware.
     */
    function ngApimockRequest(request: http.IncomingMessage, response: http.ServerResponse, next: Function): void {
        const ngapimockId = _ngApimockId(request.headers),
            type = ngapimockId !== undefined ? 'wdio' : 'runtime';

        if (request.url === '/ngapimock/mocks/record' && request.method === PUT) {
            handlers[type].recordResponseHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/mocks' && request.method === GET) {
            handlers[type].getMocksHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/mocks' && request.method === PUT) {
            handlers[type].updateMockHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/mocks/defaults' && request.method === PUT) {
            handlers[type].resetMocksToDefaultsHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/mocks/passthroughs' && request.method === PUT) {
            handlers[type].setMocksToPassThroughsHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/presets' && request.method === GET) {
            handlers[type].getPresetsHandler.handleRequest(request, response, next, registry);
        } else if (request.url === '/ngapimock/presets' && request.method === PUT) {
            handlers[type].applyPresetHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/variables' && request.method === GET) {
            handlers[type].getVariablesHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (request.url === '/ngapimock/variables' && request.method === PUT) {
            handlers[type].addOrUpdateVariableHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else if (new RegExp('/ngapimock/variables/.*').exec(request.url) !== null && request.method === DELETE) {
            handlers[type].deleteVariableHandler.handleRequest(request, response, next, registry, ngapimockId);
        } else {
            handlers[type].ngApimockHandler.handleRequest(request, response, next, registry, ngapimockId);
        }
    }

    /**
     * Registers the given mocks.
     * @param mocks The mocks.
     */
    function registerMocks(mocks: Mock[]) {
        mocks.forEach(mock =>
            _handleMock(mock, `Mock with identifier '%s' already exists. Overwriting existing mock.`));
    }

    /**
     * Registers the given mocks.
     * @param presets The presets.
     */
    function registerPresets(presets: Preset[]) {
        presets.forEach(preset =>
            _handlePreset(preset, `Preset with identifier '%s' already exists. Overwriting existing preset.`));
    }

    /**
     * Update the given mock.
     * @param mock The mock.
     */
    function updateMock(mock: Mock): void {
        _handleMock(mock, `Mock with identifier '%s' already exists. Updating existing mock.`);
    }

    function _handleMock(mock: Mock, warning: string) {
        mock.identifier = (mock.name ? mock.name : mock.expression.toString() + '$$' + mock.method);

        const match = registry.mocks.filter(_mock => mock.identifier === _mock.identifier)[0],
            index = registry.mocks.indexOf(match);

        if (index > -1) { // exists so update
            console.warn(warning, mock.identifier);
            registry.mocks[index] = mock;
        } else { // add
            registry.mocks.push(mock);
        }

        const _default = Object.keys(mock.responses).filter(key => !!mock.responses[key]['default'])[0];
        if (_default !== undefined) {
            registry.defaults[mock.identifier] = _default;
            registry.selections[mock.identifier] = _default;
        }
    }

    function _handlePreset(preset: Preset, warning: string) {
        const match = registry.presets.filter(_preset => preset.name === _preset.name)[0],
            index = registry.presets.indexOf(match);

        if (index > -1) { // exists so update
            console.warn(warning, preset.name);
            registry.presets[index] = preset;
        } else { // add
            registry.presets.push(preset);
        }
    }

    /**
     * Get the ngApimockId.
     * @param headers The request headers.
     * @returns {*}
     */
    function _ngApimockId(headers: any) {
        let ngApimockId;
        const header = headers.ngapimockid,
            cookie = _getNgApimockIdCookie(headers.cookie);

        if (header !== undefined) {
            ngApimockId = header;
        } else if (cookie !== undefined) {
            ngApimockId = cookie;
        }
        return ngApimockId;
    }

    /**
     * Get the ngApimockId from the given cookies.
     * @param cookies The cookies.
     * @returns {*}
     */
    function _getNgApimockIdCookie(cookies: string) {
        return cookies && cookies
            .split(';')
            .map(cookie => {
                const parts = cookie.split('=');
                return {
                    key: parts.shift().trim(),
                    value: decodeURI(parts.join('='))
                };
            })
            .filter(cookie => cookie.key === 'ngapimockid')
            .map(cookie => cookie.value)[0];
    }
})();
