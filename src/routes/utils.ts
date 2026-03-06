export function waitForVideo(selector: string): Promise<HTMLVideoElement> {
    return new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (el instanceof HTMLVideoElement) {
            return resolve(el);
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element instanceof HTMLVideoElement) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
