FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
);

FilePond.setOptions({
    stylePanelAspectRatio: 150/ 100,
    imageResizeTargetHeight: 100,
    imageResizeTargetWidth: 150
});

FilePond.parse(document.body);