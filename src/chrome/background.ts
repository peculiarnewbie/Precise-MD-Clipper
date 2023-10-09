import { fetchDocument } from "../utils/ElementFetcher";

chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { action: "popup" }, (response) => {});
	});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "download") {
		console.log("download: ", request.data, request.title);
		let markdownText = request.data;
		const blob = new Blob([markdownText], { type: "text/markdown" });

		// use BlobReader object to read Blob data
		const reader = new FileReader();
		reader.onload = () => {
			const buffer = reader.result;
			const blobUrl = `data:${blob.type};base64,${btoa(
				new Uint8Array(buffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					"",
				),
			)}`;
			chrome.downloads.download(
				{
					url: blobUrl,
					filename: `${request.title}`,
					saveAs: true,
					conflictAction: "uniquify",
				},
				() => {
					console.log("downloaded");
				},
			);
		};
		sendResponse({ success: true });
		reader.readAsArrayBuffer(blob);
		return;
	} else if (request.action === "closeExtension") {
		console.log("background x")
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ action: "closeExtension" },
				(response) => {
					sendResponse(response);
				},
			);
		});
		return;
	} else if (request.action === "fetchDocument"){
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			FetchDocument(tabs[0].url)
			sendResponse("collecting");
		});
	}
});

const FetchDocument = async (url) => {
	console.log("calling fetcher from bg: ", url)
	const docText = await fetchDocument(url)

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				action: "documentFetched",
				data: docText,
			},
			(response) => {
				console.log(response)
			},
		);
	});
}