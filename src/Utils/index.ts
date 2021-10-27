export const addDataIntoCache = async (
    cacheName: string,
    url: string,
    response: any
) => {
    return await new Promise((resolve) => {
        // Converting our respons into Actual Response form
        const data = new Response(JSON.stringify(response));

        if ("caches" in window) {
            // Opening given cache and putting our data into it
            caches.open(cacheName).then((cache) => {
                cache.put(url, data);
                resolve(data);
            });
        }
    });
};
