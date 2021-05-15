<template>
  <div>
    <CoolLightBox 
        :items="slides.map(s => s.cropped_picture)" 
        :index="localValue"
        @close="localValue = null" @on-change="chagenSlide">
      </CoolLightBox>
      <div class="images-wrapper">
        <div
          class="image"
          v-for="(image, imageIndex) in slides.map(s => s.cropped_picture)"
          :key="imageIndex"
          @click="localValue = imageIndex"
          :style="{ backgroundImage: 'url(' + image + ')' }"
        ></div>
      </div>
      <template v-if="localValue !== null">
        <v-card class="overlay-window meta">
          <v-card-text>
            <h1 class="mb-3">Author name: {{imageInfo.author}}</h1>
            <h1 class="mb-3">Camera model: {{imageInfo.camera}}</h1>
            <h1>hashtags: {{imageInfo.tags}}</h1>
          </v-card-text>
        </v-card>
        <v-btn color="info" @click="copyToClipboard(slides[localValue].cropped_picture)" class="overlay-window btn">Share URL</v-btn>
      </template>
      <v-snackbar color="success" style="z-index: 999999"
        v-model="copied"
      >URL copied successfully
      </v-snackbar>
  </div>
    
</template>

<script>
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

export default {
  components: {
    CoolLightBox,
  },
  name: 'Slider',
  data(){
    return {
      copied: false,
      localValue: this.value,
      imageInfo: {}
    }
  },
  watch: {
    localValue(v){
      console.log(v);
      if(v !== null){
        this.getImageInfo(this.slides[v].id)
      }
      this.imageInfo = Object.assign({}, {})
      this.$emit('input', v)
    },
    value(v){
      this.localValue = v
    }
  },
  props: {
    slides: {type: Array, default: () => []},
    value: {type: Number, default: 1}
  },
  methods: {
    copyToClipboard(text) {
      var copyText = document.createElement("input");
      copyText.type = "text";
      document.body.appendChild(copyText);
      copyText.style = "display: inline; width: 1px;";
      copyText.value = text;
      copyText.focus();
      document.execCommand("SelectAll");
      document.execCommand("Copy");
      copyText.remove();
      this.copied = true
  },
    chagenSlide(index){
      this.localValue = index
    },
    getImageInfo(id){
      this.$axios('/images/'+id)
      .then((r) =>{
        console.log(r);
        this.imageInfo = Object.assign({}, r.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay-window{
  position: fixed;
  z-index: 99999;
  left: 30px;
  &.meta{
    bottom: 30px;
    
  }
  &.btn{
    bottom: 170px;
  }
}
</style>