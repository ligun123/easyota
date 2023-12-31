<template>
  <div class="container">
    <div class="size-box">
      <div class="app-info">
        <img :src="appData.icon" alt="appData.icon" class="icon-part" />
        <div class="text-part">
          <div class="name text-margin">
            <span
              class="iconfont"
              :class="
                appData.platform == 'ios' ? 'icon-ota-ios' : 'icon-ota-android'
              "
            ></span>
            {{ this.appData.name }}
          </div>
          <div class="version text-margin">
            V{{ (appData.version || {}).version }} (build
            {{ (appData.version || {}).build }}) - {{ size }} MB
          </div>
          <div class="version text-margin">
            更新于 {{ formatDate((appData.version || {}).createTime) }}
          </div>
          <el-button-group>
            <el-button
              v-if="appData.hide_local == 0"
              type="primary"
              size="mini"
              @click="onInstallClick"
            >
              {{ appData.platform == 'ios' ? '安装IPA' : '安装APK' }}
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onGooglePlayClick"
              v-if="(appData.androidstore || '') != ''"
            >
              GooglePlay
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onYingyongbaoClick"
              v-if="(appData.yingyongbao || '') != ''"
            >
              应用宝
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onAppleStoreClick"
              v-if="(appData.applestore || '') != ''"
            >
              苹果商店
            </el-button>
          </el-button-group>
        </div>
        <div class="flex-space"></div>
        <vue-qr
          class="qr-part"
          :text="qrUrl"
          :logoSrc="appData.icon"
          :margin="8"
        ></vue-qr>
      </div>
      <el-divider></el-divider>
      <div class="previews" v-if="hasPreviews">
        <el-image
          :src="item.url"
          fit="cover"
          class="image"
          v-for="item in appData.previews"
          :key="item.id"
        ></el-image>
      </div>
      <el-divider v-if="hasPreviews"></el-divider>
      <div class="name name-margin">应用简介</div>
      <text-body class="name-margin" style="margin-top: 1.5%">
        {{ appData.adesc }}
      </text-body>
      <el-divider></el-divider>
      <div class="name name-margin">更新日志</div>
      <text-body class="name-margin" style="margin-top: 1.5%">
        {{ appData.version ? appData.version.vdesc : '' }}
      </text-body>
      <el-divider></el-divider>
      <text-label
        class="name-margin"
        style="margin-top: 10%; padding-bottom: 1%"
      >
        easyota 开源应用内测托管平台
      </text-label>
    </div>
    <img
      src="@/assets/outbrowser_backdrop@2x.png"
      alt="outside"
      class="outside"
      v-if="isInside"
    />
  </div>
</template>

<script>
// 同时支持mobile、desktop
import ResizeMixin from '@/layout/mixin/ResizeHandler';
import apiApp from '@/api/app';
import {formatDate} from '@/utils/validate';
import VueQr from 'vue-qr';
export default {
  mixins: [ResizeMixin],
  components: {
    VueQr
  },
  computed: {
    qrUrl() {
      return window.location.href;
    },
    isMobile() {
      return this.$store.state.device.device == 'mobile';
    },
    hasPreviews() {
      const previews = this.appData.previews ?? [];
      return previews.length > 0;
    },
    size() {
      const version = this.appData.version ?? {};
      const size = version.size ?? 0;
      const sizeMB = Number(size / 1024 / 1024).toFixed(1);
      return sizeMB;
    }
  },
  data() {
    return {
      appData: {},
      isInside: false
    };
  },
  mounted() {
    apiApp
      .release({
        short: this.$route.params.short,
        branch: this.$route.query.branch,
        verUuid: this.$route.query.verUuid
      })
      .then((res) => {
        this.appData = res.data.body;
        document.title = this.appData.name;
      });
  },
  methods: {
    formatDate(value) {
      return formatDate('yyyy-MM-dd hh:mm', value);
    },
    onInstallClick() {
      const isInside = this.isAppInside();
      if (isInside != false) {
        this.isInside = true;
        return;
      }
      if (this.appData.platform == 'ios') {
        const manifest = this.appData.version.manifest;
        const otaurl = `itms-services://?action=download-manifest&url=${manifest}`;
        window.open(otaurl);
      } else {
        window.open(this.appData.version.binUrl);
      }
    },
    onGooglePlayClick() {
      window.open(this.appData.androidstore);
    },
    onAppleStoreClick() {
      window.open(this.appData.applestore);
    },
    onYingyongbaoClick() {
      window.open(this.appData.yingyongbao);
    },
    isAppInside() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return 'weixin';
      } else if (ua.match(/QQ/i) == 'qq') {
        return 'QQ';
      } else if (ua.match(/Alipay/i) == 'alipay' && payway == 2) {
        return 'alipay';
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  @include flexStart;
  align-items: center;
  flex-direction: column;
  position: relative;
  .size-box {
    height: 100%;
    max-width: 1100px;
    width: 100%;
    // background-color: grey;
    .app-info {
      @include flexCenter;
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: 8%;
      padding: 2%;
      @media screen and (max-width: 690px) {
        flex-direction: column;
        align-items: center;
      }
      .icon-part {
        border-radius: 22%;
        border: 1px solid lightgray;
        width: 30%;
        max-width: 220px;
        height: auto;
      }
      .qr-part {
        width: 30%;
        max-width: 220px;
        aspect-ratio: 1;
        @media screen and (max-width: 690px) {
          margin-top: 3%;
        }
      }
      .text-part {
        @include flexStart;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 3%;
        padding-top: 2%;
        @media screen and (max-width: 690px) {
          align-items: center;
        }
        .iconfont {
          font-size: 24px;
        }
        .name {
          font-size: 24px;
          line-height: 1.25;
          font-weight: 700;
          color: #1d1d1f;
        }
        .link {
          font-size: 18px;
          line-height: 1.22226;
          font-weight: 400;
          color: #0070c9;
        }
        .version {
          font-size: 16px;
          line-height: 1.22226;
          font-weight: 400;
          color: $fontText;
        }
      }
    }
  }
  .previews {
    @include flexStart;
    overflow: auto;
    .image {
      width: 35%;
      min-width: 180px;
      margin: 1%;
      border-radius: 8px;
    }
  }

  .outside {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: #0070c9;
    z-index: 100;
  }
}

.flex-space {
  flex-grow: 100;
}
.text-margin {
  margin-bottom: 8%;
  @media screen and (max-width: 768px) {
    margin-bottom: 6%;
  }
  @media screen and (max-width: 568px) {
    margin-bottom: 3%;
  }
}
.name {
  font-size: 24px;
  line-height: 1.25;
  font-weight: 700;
  color: #1d1d1f;
}
.name-margin {
  padding-left: 2%;
}
</style>
