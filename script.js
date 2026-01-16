(function () {
    // Run after DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        // Devtools detection (same logic as original)
        if (
            window.outerWidth - window.innerWidth > 160 ||
            window.outerHeight - window.innerHeight > 160
        ) {
            return;
        }

        // Create container if missing
        let container = document.getElementById("nsfinfodata");
        if (!container) {
            container = document.createElement("div");
            container.id = "nsfinfodata";
            document.body.appendChild(container);
        }

        // Apply styles
        Object.assign(container.style, {
            position: "fixed",
            top: "0",
            left: "-500px",
            width: "320px",
            background: "#fff",
            padding: "10px",
            zIndex: "9999"
        });

        const CACHE_KEY = "nsf_top_posts_cache";
        const TIME_KEY = "nsf_top_posts_cache_time";
        const CACHE_TTL = 216e5; // 6 hours

        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(TIME_KEY);

        if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_TTL) {
            render(JSON.parse(cachedData));
        } else {
            fetch("https://healthyfoodforwellness.com/cronImport/topPostsApi")
                .then((res) => res.json())
                .then((data) => {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                    localStorage.setItem(TIME_KEY, Date.now());
                    render(data);
                })
                .catch(() => {
                    localStorage.setItem(CACHE_KEY, JSON.stringify([]));
                    localStorage.setItem(TIME_KEY, Date.now());
                    container.innerHTML = "";
                });
        }

        function render(items) {
            if (!Array.isArray(items)) return;

            const ul = document.createElement("ul");

            items.forEach((item) => {
                const li = document.createElement("li");
                const a = document.createElement("a");

                a.href = item.url;
                a.target = "_blank";
                a.textContent = item.title;

                li.appendChild(a);
                ul.appendChild(li);
            });

            container.innerHTML = "";
            container.appendChild(ul);
        }
    }
})();
