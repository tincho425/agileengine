<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" md="4" lg="3"   v-for="img,i in images" :key="'img-'+i">
      <v-img :src="img.cropped_picture" @click="imgPicked(img, i)"
      ></v-img>
    </v-col>
    <v-col cols="12" class="text-center">
      <v-pagination
        v-model="page"
        :length="pages"
      ></v-pagination>
      <Slider v-model="imgIndex" :slides="images" />
    </v-col>
  </v-row>
</template>

<script>

export default {
  data() {
    return {
      images: [],
      imgIndex: null,
      page: 1,
      pages: 1,
      overlay: false
    }
  },
  watch: {
    page(p){
      console.log('watch ', p);
      this.$router.push({name: this.$route.name, query: {page: p}})
      this.getImages({page: p})
    }
  },
  methods:{
    getImages({page = 1} = {}){
      this.$axios('/images', {params: {
        page
      }})
      .then((response) => {
        if( response.data.hasOwnProperty('pictures') )
          this.images = response.data.pictures
        if( response.data.hasOwnProperty('pageCount') )
          this.pages = response.data.pageCount
      }).catch(e => {
        console.log(e);
      })
    },
    imgPicked(img,index){
      this.overlay = true
      this.imgIndex = index
    }
  },
  mounted(){
    let pNumber = (typeof this.$route.query.page === 'undefined') ? 1 : this.$route.query.page
    console.log(pNumber);
    console.log( typeof pNumber === 'string' &&  !isNaN( parseInt(pNumber) ) );
    if( typeof pNumber === 'string' &&  !isNaN( parseInt(pNumber) )){
      pNumber = parseInt(pNumber)
      console.log(pNumber);
      this.page = pNumber
      this.getImages({page: pNumber})
    }else{
      this.getImages({page: pNumber})
    }
  }
}
</script>
