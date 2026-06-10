export class AssetLoader {
    constructor() {
        this.images = new Map();
        this.audio = new Map();
    }

    async loadAll(assets) {
        const jobs = assets.map((asset) => this.load(asset));
        await Promise.all(jobs);

        return {
            images: this.images,
            audio: this.audio
        };
    }

    load(asset) {
        if (asset.type === "image") {
            return this.loadImage(asset.name, asset.url);
        }

        if (asset.type === "audio") {
            return this.loadAudio(asset.name, asset.url);
        }

        throw new Error(`Unsupported asset type: ${asset.type}`);
    }

    loadImage(name, url) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.addEventListener("load", () => {
                this.images.set(name, image);
                resolve(image);
            }, false);

            image.addEventListener("error", () => {
                reject(new Error(`Failed to load image: ${url}`));
            }, false);

            image.src = url;
        });
    }

    loadAudio(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();

            audio.addEventListener("canplaythrough", () => {
                this.audio.set(name, audio);
                resolve(audio);
            }, { once: true });

            audio.addEventListener("error", () => {
                reject(new Error(`Failed to load audio: ${url}`));
            }, { once: true });

            audio.src = url;
        });
    }
}
