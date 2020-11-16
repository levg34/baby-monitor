# baby-monitor
Little app to follow up the baby bottles and nappies changes, as well as the weight and height

## Install and run:

You need npm version 5.8.0 or more, and node v10.21.0 or more.

```bash
npm install
npm run
```

Then go to `localhost:8080`

### Docker

To run in a docker container (you need a running installation of Docker), simply do:

```bash
docker-compose up --build
```

If you do not have `docker-compose` (and do not plan on installing it), you can do:

```bash
docker build -t baby-monitor .
docker run -p 80:8080 -d baby-monitor
```

Then go to `localhost`

## Translations

### Add a new language

If you want to add your language, create your language file as JSON in `i18n` folder with the name of the locale. The file encoding must be UTF-8.

For example, to add russian translations, create `i18n/ru.json`

Add at minima the english name of the language, you can also add the local name:

```json
{
  "english_name": "russian",
  "local_name": "Ру́сский"
}
```

To add an image for the russian language, download the image at https://www.freeflagicons.com/country/russia/rectangular_icon_with_iso_code/download/ (the size must be [256px](https://www.freeflagicons.com/download/?series=rectangular_icon_with_iso_code&country=russia&size=256))

```json
{
  ...
  "image": "russian.png"
}
```

To add translations, follow the model of the other translation files. For exemple, to add a translation for the title in russian, find the path on the HTML file or on the `i18n/en.json` file, and add it to your file:

```json
{
  ...
  "jumbo": {
	"title": "Наблюдение за ребенком"
  }
}
```

Full example:

`i18n/ru.json` :

```json
{
  "english_name": "russian",
  "local_name": "Ру́сский",
  "image": "russian.png",
  "jumbo": {
	"title": "Наблюдение за ребенком"
  }
}
```

### Add new translations

To add missing translations in existing languages, find the language file in the `i18n` folder.

Then add the missing translations by comparing with the `i18n/en.json` file.
