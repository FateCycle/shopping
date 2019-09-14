<template>
  <div>
    <nav-header ></nav-header>
    <nav-bread>
        <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter" :class="filterby?'filterby-show':'stopPop'" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" :class="{cur:num==='all'}" @click="setPriceFilter('all')">All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter">
                <a
                  href="javascript:void(0)"
                  :class="{cur:num===index}"
                  @click="setPriceFilter(index)"
                >{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'../../static/'+item.productImage" alt />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
                  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50" v-show='loading'>
                    <img src="../assets/loading-spinning-bubbles.svg" alt="">
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :mdShow="mdShow" @close="closeModal">
    <template v-slot:title>
      <h1>已经成功加入购物车</h1>
    </template>
    <template v-slot:btnGroup>
      <a href='javscript:;' class='btn btn--m' @click="closeModal">继续购物</a>
      <router-link href='javscript:;' class='btn btn--m' to='/cart'>转到购物车</router-link>
    </template>

    </modal>
    <div class="md-overlay" v-show="filterby" @click="closeFilterPop"></div>
    
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import "@/assets/css/base.css";
import "@/assets/css/product.css";
import NavHeader from "../components/NavHeader";
import NavFooter from "@/components/NavFooter";
import NavBread from "@/components/NavBread";
import Modal from '@/components/Modal';
//自动回去node_modules查找
import axios from "axios";
export default {
  data() {
    return {
      mdShow:false,
      loading:false,
      busy:true,
      sortflag: 1,
      pageSize: 8,
      page: 1,
      filterby: false,
      num: "all",
      goodsList: [],
      priceFilter: [
        {
          startPrice: 0.0,
          endPrice: 1000.0
        },
        {
          startPrice: 1000.0,
          endPrice: 2000.0
        },
        {
          startPrice: 2000.0,
          endPrice: 3000.0
        }
      ]
    };
  },
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    Modal,
  },
  mounted: function() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag=false) {
      let params={
            "page": this.page,
            "pageSize": this.pageSize,
            "sort": this.sortflag,
            "num":this.num,
          };
      if(this.num!=='all'){
        params.gtPrice=this.priceFilter[this.num].startPrice;
        params.ltPrice=this.priceFilter[this.num].endPrice;
      }
      this.loading=true;
      axios
        .get("/goods", {
          params: params
        })
        .then(res => {
          if (res.data.status === 1) this.goodsList = [];
          else{
            if(flag){
              this.busy = false;
              if(res.data.result.count===0) this.busy=true; 
              this.goodsList=this.goodsList.concat(res.data.result.list);
            }else{
              this.page=1;
              this.goodsList = res.data.result.list;
              this.busy=false;
            }
          }
          this.loading=false;
        })
        .catch(error => console.log(res.status));
    },
    showFilterPop() {
      this.filterby = true;
    },
    closeFilterPop() {
      this.filterby = false;
    },
    setPriceFilter(index) {
      this.num = index;
      this.closeFilterPop();
      this.page=1;
      this.getGoodsList(false);
    },
    sortGoods() {
      this.sortflag = -this.sortflag;
      this.page = 1;
      this.getGoodsList();
    },
     loadMore: function() {
      this.busy = true;
      //1s后执行也就是在这1s时间里busy始终为true，所以鼠标滚动不会触发loadMore事件
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 1000);
    },
    addCart(productId){
      axios.post('/goods/addCart',{
        productId:productId,
      }).then(res=>{
        this.mdShow=true;
        if(res.data.status===1)
          this.$store.commit('updateCartCount',1);
      }).catch((err)=>alert(err))
    },
    closeModal(){
      this.mdShow=false;
    }
  }
};
</script>
<style scoped>
  /* .btn:hover{
    background-color: rgb(226, 62, 62);
    transition: all .3s ease-out
  } */
</style>
