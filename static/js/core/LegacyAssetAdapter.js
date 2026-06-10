import { AssetLoader } from "./AssetLoader.js";
import { GAME_ASSETS, IMAGE_ASSETS, AUDIO_ASSETS } from "../config/assets.js";

const assetApi = {
    manifest: GAME_ASSETS,
    images: IMAGE_ASSETS,
    audio: AUDIO_ASSETS,
    createLoader() {
        return new AssetLoader();
    },
    async preload() {
        const loader = new AssetLoader();
        const loadedAssets = await loader.loadAll(GAME_ASSETS);

        return {
            loader,
            ...loadedAssets
        };
    }
};

// Runtime bridge for the legacy game while asset loading is migrated.
// The legacy script still performs its own loading; this exposes the new
// manifest and loader without changing current gameplay behaviour.
window.gameAssets = assetApi;

export { assetApi };
