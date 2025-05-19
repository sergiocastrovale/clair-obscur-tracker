# Clair Obscur: Expedition 33 Companion

This tool is meant to be your map companion in Clair Obscur: Expedition 33. 

Unlike other excellent tracking tools that allow you to track every single thing the game has to offer, this will only take in consideration locations and bosses.

Hopefully this tool will help you navigate the game a bit better without spoiling away any of the progression.

You can use it at <https://clair-obscur-tracker.vercel.app/>.

# But I want to get all achievements!

If you are looking for a completionist type of map, use the two best sources of information on the internet:

* MapGenie's [checklist](https://mapgenie.io/clair-obscur-expedition-33/checklist) and [map](https://mapgenie.io/clair-obscur-expedition-33/maps/the-continent)

* [The Fextralife Wiki](https://expedition33.wiki.fextralife.com/Expedition+33+Wiki)

# Why did you build this?

I was looking for an excuse to do an almost-vibe-coding project as quickly as possible. 

Given that not being able to track the locations and bosses you've beaten is probably the ONLY flaw of this game, this seemed like a quick - but useful - project to work on.

# Caveats

This tool uses your browser's Local Storage - which means, the list is only stored in your browser. As such, there's no login or multi-device sync whatsoever and everything is saved in the machine/browser you're interacting with.

I added an import / export feature so that the data could be saved and used in multiple places, but this is a manual process. Keep in mind that if you clear cookies and local storage in said browser, you will lose all your tracked progress.

# Local setup

## Running the project

```bash
pnpm i
pnpm run dev
```

## Tile generation

The map uses [Leaflet.js](https://leafletjs.com) and is based on the `public/map.png` - the high resolution source with which the map tiles are built.

To build the tiles, simply run `node tiles`. You don't _need to do this_ - the tiles included in this repo - but feel free to play around if you want.