module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      },
      "element"
    ],
    [
      "component",
      {
        "libraryName": "sfabric-component",
        "style":false
      },
      "sfabric"
    ]
  ]
}
