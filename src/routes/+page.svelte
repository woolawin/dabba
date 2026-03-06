<script lang="ts">
    import { waitForVideo } from "./utils";
    const SCREEN_HOME = "HOME";
    const SCREEN_CAMERA = "CAMERA";
    const SCREEN_TEXT = "TEXT";
    const SCREEN_TRANSLATION = "TRANSLATION";

    let video: HTMLVideoElement | null;
    let screen: string = SCREEN_HOME;
    let text: string;
    let translation: object | null;

    async function startCamera() {
        screen = SCREEN_CAMERA;
        video = await waitForVideo("video");

        if (!video) {
            console.log("could not get video");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                },
            });
            video.srcObject = stream;
            await video.play();
        } catch (err) {
            screen = SCREEN_HOME;
            console.error("Camera could not start:", err);
            alert(err);
        }
    }

    function closeCamera() {
        video = null;
        screen = SCREEN_HOME;
    }

    async function readPage() {
        video = await waitForVideo("video");

        if (!video) {
            console.log("could not get video");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx == null) {
            return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");

        const resp = await fetch("/api/read", {
            method: "POST",
            body: JSON.stringify({ image: imageData }),
        });
        const payload = await resp.json();
        text = payload.text;
        screen = SCREEN_TEXT;
    }

    async function translate() {
        const textarea: HTMLTextAreaElement | null =
            document.querySelector("#readtext");
        if (!textarea) {
            return;
        }
        const selectedText = textarea.value.substring(
            textarea.selectionStart,
            textarea.selectionEnd,
        );

        const resp = await fetch("/api/translate", {
            method: "POST",
            body: JSON.stringify({ original: text, selected: selectedText }),
        });
        const payload = await resp.json();

        translation = payload;
        screen = SCREEN_TRANSLATION;
    }
</script>

{#if screen == SCREEN_CAMERA}
    <div>
        <video id="video" autoplay muted playsinline class="camera-feed"
        ></video>
        <button class="close-btn" onclick={closeCamera}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-xbox-x"
                ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                    d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9"
                /><path d="M9 8l6 8" /><path d="M15 8l-6 8" /></svg
            >
            Close
        </button>

        <button class="read-btn" onclick={readPage}> Read </button>
    </div>
{/if}
{#if screen == SCREEN_HOME}
    <div class="home">
        <button onclick={startCamera} class="take-picture">Take Picture</button>
    </div>
{/if}

{#if screen == SCREEN_TEXT}
    <div class="text">
        <textarea id="readtext" readonly>{text}</textarea>
        <button onclick={translate} class="translate">Translate</button>
    </div>
{/if}

{#if screen == SCREEN_TRANSLATION}
    <div class="translation">
        <p>
            {translation?.translation}
        </p>
    </div>
{/if}

<style>
    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100%;
    }

    .text,
    .translation,
    .home {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: #efe6d2;
        display: flex;
        flex-direction: column;
        padding: 10px;
        justify-content: space-around;
    }

    .translation p {
        text-align: center;
    }

    .translate {
        border: none;
        height: 50px;
        background-color: #78c48c;
        color: white;
    }

    .camera-feed {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        display: block;
    }

    .take-picture {
        background-color: #6fa8d6;
        border: none;
        height: 50px;
        color: white;
    }

    .close-btn {
        position: absolute;
        top: 50px;
        left: 10px;
        right: 10px;
        color: white;
        background-color: transparent;
        border-radius: 5px;
        box-shadow: none;
        appearance: none;
        border-color: white;
        padding: 10px;
        font-size: 24px;
    }

    .read-btn {
        position: absolute;
        bottom: 50px;
        left: 10px;
        right: 10px;
        color: white;
        background-color: transparent;
        border-radius: 5px;
        box-shadow: none;
        appearance: none;
        border-color: white;
        padding: 10px;
        font-size: 24px;
    }
</style>
