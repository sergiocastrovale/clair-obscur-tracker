<script setup lang="ts">
import { GitBranch } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue';
import { Info } from 'lucide-vue-next';
import Toaster from '@/components/ui/toast/Toaster.vue';
import Filters from '@/components/Filters.vue';
</script>

<template>
  <div>
    <nav class="text-stone-400 flex flex-col bg-stone-950 z-40 fixed top-0 left-0 w-full">
      <div class="container mx-auto flex justify-between items-center p-2">
        <h1 class="font-semibold text-lg">CO:E33 Companion</h1>
        <div class="flex gap-3 items-center">
          <Dialog>
            <DialogTitle class="sr-only">About</DialogTitle>
            <DialogTrigger>
              <Info class="hover:text-stone-200" :size="21" />
            </DialogTrigger>
            <DialogContent  class="bg-zinc-900 border-0">
              <DialogDescription class="text-zinc-200 bg-zinc-900">
                <h3 class="font-semibold text-lg mb-2">What's this?</h3>
                <p class="mb-3">This tool is meant to be your map companion in Clair Obscur: Expedition 33.</p>
                <p>
                  Unlike other excellent tracking tools that allow you to track every single thing the game has to offer,
                  this will only take in consideration locations and bosses.
                </p>
                <p>
                  Hopefully this tool will help you navigate the game a bit better without spoiling away any
                  progression.
                </p>

                <h3 class="font-semibold text-lg mb-2 mt-5">But I want to get all achievements!</h3>
                <p class="mb-3">
                  If you are looking for a completionist type of map, use the two best sources of information on the internet:
                </p>

                <ul class="list-disc list-inside mb-3">
                  <li> <a href="https://mapgenie.io/clair-obscur-expedition-33" target="_blank" class="underline" rel="noopener noreferrer">MapGenie</a></li>
                  <li><a href="https://expedition33.wiki.fextralife.com/Expedition+33+Wiki" target="_blank" class="underline" rel="noopener noreferrer">The Fextralife Wiki</a></li>
                </ul>

                <h3 class="font-semibold text-lg mb-2 mt-5">Why did you build this?</h3>
                <p class="mb-3">
                  I was looking for an excuse to do an almost-vibe-coding project as quickly as possible.
                </p>
                <p>
                  Given that not being able to track the locations and bosses you've beaten is probably the ONLY flaw of this game, this seemed like a quick - but useful - project to work on.
                </p>

                <h3 class="font-semibold text-lg mb-2 mt-5">Caveats</h3>
                <p class="mb-3">This tool uses your browser's Local Storage - which means, the list is only stored in your
                  browser. As such, there's no login or multi-device sync whatsoever and everything is saved in the machine/browser
                  you're interacting with.</p>

                <p>Keep in mind that if you clear cookies and local storage in said browser, you will lose all your tracked
                  progress.</p>
              </DialogDescription>
            </DialogContent>

          </Dialog>

          <a id="kofi" href="https://ko-fi.com/D1D11FEPF7" target="_blank" rel="noopener noreferrer">
            <img src="https://storage.ko-fi.com/cdn/kofi3.png?v=6" alt="Buy Me a Coffee" />
          </a>
        </div>
      </div>

      <Filters />
    </nav>
    <Toaster />
  </div>
</template>

<style>
#kofi > img {
  height: 36px;
}
</style>
