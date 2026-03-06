<script lang="ts">
    let video: HTMLVideoElement;

    async function startCamera() {
        if (!video) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            video.srcObject = stream;
            await video.play(); // muted + playsinline needed
        } catch (err) {
            console.error("Camera could not start:", err);
            alert("Check camera permissions and HTTPS");
        }
    }
</script>

<video bind:this={video} autoplay muted playsinline class="camera-feed"></video>
<button on:click={startCamera}>Start Camera</button>

<style>
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
    }
    .camera-feed {
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        display: block;
    }
    button {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 10;
    }
</style>
