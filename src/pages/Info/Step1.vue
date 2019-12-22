<template>
  <div class="step1">
    <!-- 编辑个人资料 -->
    <div v-show="!type || (type=='edit' && tar=='self')">
      <!-- 姓名 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-card"></i>
          <span>{{$t("Info.step1.title1")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <el-input
            v-model="step1.nickname"
            clearable
            style="width:200px"
            :placeholder="$t('Info.step1.placeholder1')"
            @input="onUnameInput"
          ></el-input>
          <i class="icon-success" v-show="showError && step1.nickname && unameL<=20"></i>
          <i class="icon-error" v-show="showError && !step1.nickname"></i>
          <i class="icon-error" v-show="unameL>20"></i>
          <span class="prompt-error" v-show="unameL>20">{{$t("Info.step1.prompt1")}}</span>
        </el-col>
      </el-row>
      <!-- 性别 -->
      <el-row class="info-item" v-show="!type">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-gender"></i>
          <span>{{$t("Info.step1.title2")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <el-radio v-model="step1.sex" label="0">
            <i class="icon-famale"></i>
          </el-radio>
          <el-radio v-model="step1.sex" label="1">
            <i class="icon-male"></i>
          </el-radio>
        </el-col>
      </el-row>
      <!-- 生日 -->
      <el-row class="info-item" v-show="!type">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-date"></i>
          <span>{{$t("Info.step1.title3")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <el-date-picker
            v-model="step1.birthday"
            type="date"
            :placeholder="$t('Info.step1.placeholder5')"
            style="width:200px"
          ></el-date-picker>
          <i class="icon-success" v-show="showError && step1.birthday"></i>
          <i class="icon-error" v-show="showError && !step1.birthday"></i>
        </el-col>
      </el-row>
      <!-- 身高 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-height"></i>
          <span>{{$t("Info.step1.title4")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select :options="heightOption" scroll="550px" v-model="step1.height" width="150px"></oe-select>
          <i class="icon-success" v-show="showError && step1.height"></i>
          <i class="icon-error" v-show="showError && !step1.height"></i>
        </el-col>
      </el-row>
      <!-- 体重 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-weight"></i>
          <span>{{$t("Info.step1.title5")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select :options="weightOption" scroll="300px" v-model="step1.weight" width="150px"></oe-select>
          <i class="icon-success" v-show="showError && step1.weight"></i>
          <i class="icon-error" v-show="showError && !step1.weight"></i>
        </el-col>
      </el-row>
      <!-- 收入 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-income"></i>
          <span>{{$t("Info.step1.title6")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select :options="$t('Info.step1.incomeOption')" v-model="step1.income" width="150px"></oe-select>
          <i class="icon-success" v-show="showError && step1.income!==''"></i>
          <i class="icon-error" v-show="showError && step1.income===''"></i>
        </el-col>
      </el-row>
      <!-- 工作城市 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-location"></i>
          <span>{{$t("Info.step1.title7")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="countryOption"
            v-model="step1.work_province"
            width="250px"
            :placeholder="$t('Info.step1.placeholder3')"
            style="marginBottom:8px"
            @change="onSelectChange"
            id="work"
            ref="work_province"
          ></oe-select>
          <oe-select
            :options="workCityOption"
            v-model="step1.work_city"
            width="250px"
            :placeholder="$t('Info.step1.placeholder4')"
            ref="work_city"
          ></oe-select>
          <i class="icon-success" v-show="showError" v-if="step1.work_province && step1.work_city"></i>
          <i class="icon-error" v-show="showError" v-else></i>
        </el-col>
      </el-row>
      <!-- 期望结婚时间 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-time"></i>
          <span>{{$t("Info.step1.title8")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.marryTimeOption')"
            v-model="step1.expect_marry_time"
            width="150px"
          ></oe-select>
          <i class="icon-success" v-show="showError && step1.expect_marry_time!==''"></i>
          <i class="icon-error" v-show="showError && step1.expect_marry_time===''"></i>
        </el-col>
      </el-row>
      <!-- 出生城市 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-building"></i>
          <span>{{$t("Info.step1.title9")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="countryOption"
            v-model="step1.province"
            width="250px"
            :placeholder="$t('Info.step1.placeholder3')"
            style="marginBottom:8px"
            @change="onSelectChange"
            id="birth"
            ref="province"
          ></oe-select>
          <oe-select
            :options="birthCityOption"
            v-model="step1.city"
            width="250px"
            :placeholder="$t('Info.step1.placeholder4')"
            ref="city"
          ></oe-select>
          <i class="icon-success" v-show="showError" v-if="step1.province && step1.city"></i>
          <i class="icon-error" v-show="showError" v-else></i>
        </el-col>
      </el-row>
      <!-- 工作 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-job"></i>
          <span>{{$t("Info.step1.title10")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <el-input
            v-model="step1.occupation"
            clearable
            style="width:200px"
            :placeholder="$t('Info.step1.placeholder2')"
            @input="onJobInput"
          ></el-input>
          <i class="icon-success" v-show="showError && step1.occupation && jobL<=8"></i>
          <i class="icon-error" v-show="showError && !step1.occupation"></i>
          <i class="icon-error" v-show="jobL>8"></i>
          <span class="prompt-error" v-show="jobL>8">{{$t("Info.step1.prompt2")}}</span>
        </el-col>
      </el-row>
      <!-- 婚姻状况 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-marry"></i>
          <span>{{$t("Info.step1.title11")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.marriageOption')"
            v-model="step1.marriage_status"
            width="110px"
          ></oe-select>
          <i class="icon-success" v-show="showError && step1.marriage_status!==''"></i>
          <i class="icon-error" v-show="showError && step1.marriage_status===''"></i>
        </el-col>
      </el-row>
      <!-- 信仰 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-faith"></i>
          <span>{{$t("Info.step1.title12")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select :options="$t('Info.step1.faithOption')" v-model="step1.faith" width="110px"></oe-select>
          <i class="icon-success" v-show="showError && step1.faith!==''"></i>
          <i class="icon-error" v-show="showError && step1.faith===''"></i>
        </el-col>
      </el-row>
      <!-- 喝酒 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-wine"></i>
          <span>{{$t("Info.step1.title13")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.alcoholOption')"
            v-model="step1.alcohol"
            width="200px"
          ></oe-select>
          <i class="icon-success" v-show="showError && step1.alcohol!==''"></i>
          <i class="icon-error" v-show="showError && step1.alcohol===''"></i>
        </el-col>
      </el-row>
      <!-- 抽烟 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-smoke"></i>
          <span>{{$t("Info.step1.title14")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select :options="$t('Info.step1.smokeOption')" v-model="step1.smoke" width="200px"></oe-select>
          <i class="icon-success" v-show="showError && step1.smoke!==''"></i>
          <i class="icon-error" v-show="showError && step1.smoke===''"></i>
        </el-col>
      </el-row>
      <!-- 子女 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-child"></i>
          <span>{{$t("Info.step1.title15")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.childOption')"
            v-model="step1.have_childern"
            width="110px"
          ></oe-select>
          <i class="icon-success" v-show="showError && step1.have_childern!==''"></i>
          <i class="icon-error" v-show="showError && step1.have_childern===''"></i>
        </el-col>
      </el-row>
    </div>
    <!-- 展示个人资料 -->
    <div v-show="type=='show'">
      <!-- 姓名 -->
      <el-row class="show-item" v-show="tar=='self'">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-card"></i>
          <span>{{$t("Info.step1.title1")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.nickname||$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 生日 -->
      <el-row class="show-item" v-show="tar=='self'">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-date"></i>
          <span>{{$t("Info.step1.title3")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(typeof(userInfo.birthday)=="string" && userInfo.birthday)||$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 年龄 -->
      <el-row class="show-item" v-show="tar=='mate'">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-date"></i>
          <span>{{$t("Info.step1.title17")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.age?userInfo.age:$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 身高 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-height"></i>
          <span>{{$t("Info.step1.title4")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.height?userInfo.height+"cm":$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 体重 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-weight"></i>
          <span>{{$t("Info.step1.title5")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.weight?userInfo.weight+"kg":$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 收入 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-income"></i>
          <span>{{$t("Info.step1.title6")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.income==""||userInfo.income==undefined)?$t("Info.step1.title16"):userInfo.income}}</span>
        </el-col>
      </el-row>
      <!-- 工作城市 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-location"></i>
          <span>{{$t("Info.step1.title7")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.workProvince?(userInfo.workProvince+" - "+userInfo.workCity):$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 期望结婚时间 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-time"></i>
          <span>{{$t("Info.step1.title8")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.expectMarryTime==""||userInfo.expectMarryTime==undefined)?$t("Info.step1.title16"):userInfo.expectMarryTime}}</span>
        </el-col>
      </el-row>
      <!-- 出生城市 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-building"></i>
          <span>{{$t("Info.step1.title9")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.province?(userInfo.province+" - "+userInfo.city):$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 职业 -->
      <el-row class="show-item" v-show="tar=='self'">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-job"></i>
          <span>{{$t("Info.step1.title10")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{userInfo.occupation||$t("Info.step1.title16")}}</span>
        </el-col>
      </el-row>
      <!-- 婚姻状况 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-marry"></i>
          <span>{{$t("Info.step1.title11")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.marriageStatus==""||userInfo.marriageStatus==undefined)?$t("Info.step1.title16"):userInfo.marriageStatus}}</span>
        </el-col>
      </el-row>
      <!-- 信仰 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-faith"></i>
          <span>{{$t("Info.step1.title12")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.faith==""||userInfo.faith==undefined)?$t("Info.step1.title16"):userInfo.faith}}</span>
        </el-col>
      </el-row>
      <!-- 喝酒 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-wine"></i>
          <span>{{$t("Info.step1.title13")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.alcohol==""||userInfo.alcohol==undefined)?$t("Info.step1.title16"):userInfo.alcohol}}</span>
        </el-col>
      </el-row>
      <!-- 抽烟 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-smoke"></i>
          <span>{{$t("Info.step1.title14")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.smoke==""||userInfo.smoke==undefined)?$t("Info.step1.title16"):userInfo.smoke}}</span>
        </el-col>
      </el-row>
      <!-- 子女 -->
      <el-row class="show-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-child"></i>
          <span>{{$t("Info.step1.title15")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <span>{{(userInfo.haveChildern==""||userInfo.haveChildern==undefined)?$t("Info.step1.title16"):userInfo.haveChildern}}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 编辑择偶标准 -->
    <div v-show="type=='edit' && tar=='mate'">
      <!-- 年龄 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-date"></i>
          <span>{{$t("Info.step1.title17")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select :options="ageOption" v-model="mateInfo.mate_age_start" width="150px"></oe-select>
          <span>～</span>
          <oe-select :options="ageOption" v-model="mateInfo.mate_age_end" width="150px"></oe-select>
        </el-col>
      </el-row>
      <!-- 身高 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-height"></i>
          <span>{{$t("Info.step1.title4")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="heightOption"
            scroll="550px"
            v-model="mateInfo.mate_height_start"
            width="150px"
          ></oe-select>
          <span>～</span>
          <oe-select
            :options="heightOption"
            scroll="550px"
            v-model="mateInfo.mate_height_end"
            width="150px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 体重 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-weight"></i>
          <span>{{$t("Info.step1.title5")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="weightOption"
            scroll="300px"
            v-model="mateInfo.mate_weight_start"
            width="150px"
          ></oe-select>
          <span>～</span>
          <oe-select
            :options="weightOption"
            scroll="300px"
            v-model="mateInfo.mate_weight_end"
            width="150px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 收入 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-income"></i>
          <span>{{$t("Info.step1.title6")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.incomeOption')"
            v-model="mateInfo.mate_income"
            width="150px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 工作城市 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-location"></i>
          <span>{{$t("Info.step1.title7")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="countryOption"
            v-model="mateInfo.mate_work_province"
            width="250px"
            :placeholder="$t('Info.step1.placeholder3')"
            style="marginBottom:8px"
            @change="onSelectChange"
            id="work"
            ref="work_province"
          ></oe-select>
          <oe-select
            :options="workCityOption"
            v-model="mateInfo.mate_work_city"
            width="250px"
            :placeholder="$t('Info.step1.placeholder4')"
            ref="work_city"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 期望结婚时间 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-time"></i>
          <span>{{$t("Info.step1.title8")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.marryTimeOption')"
            v-model="mateInfo.mate_expect_marry_time"
            width="150px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 出生城市 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-building"></i>
          <span>{{$t("Info.step1.title9")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="countryOption"
            v-model="mateInfo.mate_province"
            width="250px"
            :placeholder="$t('Info.step1.placeholder3')"
            style="marginBottom:8px"
            @change="onSelectChange"
            id="birth"
            ref="mate_province"
          ></oe-select>
          <oe-select
            :options="birthCityOption"
            v-model="mateInfo.mate_city"
            width="250px"
            :placeholder="$t('Info.step1.placeholder4')"
            ref="mate_city"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 婚姻状况 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-marry"></i>
          <span>{{$t("Info.step1.title11")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.marriageOption')"
            v-model="mateInfo.mate_marriage_status"
            width="110px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 信仰 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-faith"></i>
          <span>{{$t("Info.step1.title12")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.faithOption')"
            v-model="mateInfo.mate_faith"
            width="110px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 喝酒 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-wine"></i>
          <span>{{$t("Info.step1.title13")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.alcoholOption')"
            v-model="mateInfo.mate_alcohol"
            width="200px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 抽烟 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-smoke"></i>
          <span>{{$t("Info.step1.title14")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.smokeOption')"
            v-model="mateInfo.mate_smoke"
            width="200px"
          ></oe-select>
        </el-col>
      </el-row>
      <!-- 子女 -->
      <el-row class="info-item">
        <el-col :span="$store.state.lang=='en'?9:7">
          <i class="icon-child"></i>
          <span>{{$t("Info.step1.title15")}}</span>
        </el-col>
        <el-col :span="$store.state.lang=='en'?15:17">
          <oe-select
            :options="$t('Info.step1.childOption')"
            v-model="mateInfo.mate_have_childern"
            width="110px"
          ></oe-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import OeSelect from "@/components/UI/OeSelect";
import { computeLength } from "@/assets/utils/public.js";
import country_zh from "@/assets/lang/zh_country.js";
import country_en from "@/assets/lang/en_country.js";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
import { getCountry, getCity, setCountryLang } from "@/assets/utils/public.js";
export default {
  name: "Step1",
  props: ["type", "id", "userInfo", "tar"],
  components: { OeSelect },
  data() {
    return {
      ageOption: [],
      heightOption: [],
      weightOption: [],
      countryOption: [],
      workCityOption: [],
      birthCityOption: [],
      step1: {
        id: "",
        token: "",
        nickname: "",
        sex: "0",
        birthday: "Tue Jan 01 1980 00:00:00 GMT+0800",
        height: "",
        weight: "",
        income: "",
        work_province: "",
        work_city: "",
        expect_marry_time: "",
        province: "",
        city: "",
        occupation: "",
        marriage_status: "",
        faith: "",
        alcohol: "",
        smoke: "",
        have_childern: ""
      },
      mateInfo: {
        mate_age_start: "",
        mate_age_end: "",
        mate_height_start: "",
        mate_height_end: "",
        mate_weight_start: "",
        mate_weight_end: "",
        mate_income: "",
        mate_work_province: "",
        mate_work_city: "",
        mate_expect_marry_time: "",
        mate_province: "",
        mate_city: "",
        mate_marriage_status: "",
        mate_faith: "",
        mate_alcohol: "",
        mate_smoke: "",
        mate_have_childern: ""
      },
      unameL: 0,
      jobL: 0,
      showError: false,
      country: []
    };
  },
  watch: {
    lang(val) {
      this.countryOption = setCountryLang();
    },
    type: {
      handler(val) {
        if(!this.userInfo.id) return;
        if (this.type == "edit" && this.userInfo.id) {
          this.step1 = Object.assign(this.userInfo);
          console.log(this.step1)
          for (var p of this.countryOption) {
            if (p.value == this.step1.work_province) {
              this.$refs.work_province.onSelectOption(p.index);
              this.$nextTick(()=>{
                this.$set(this.step1,'work_city',this.step1.workCity);
              })
            }
            if (p.value == this.userInfo.province) {
              this.$refs.province.onSelectOption(p.index);
              this.$nextTick(()=>{
                this.$set(this.step1,'city',this.step1.birthCity);
              });
            }
          }
        }
        if (this.type == "edit" && this.userInfo && this.tar == "mate") {
          this.mateInfo = this.userInfo;
        }
      },
      deep: true
    }
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    }
  },
  mounted() {
    this.$parent.step = 1;
    this.step1.id = this.$store.state.userInfo.id;
    this.step1.token = this.$store.state.userInfo.token;
    for (var i = 140; i <= 250; i++) {
      this.heightOption.push({
        label: i + "cm / " + (i / 30.48).toFixed(2) + "ft",
        value: i
      });
    }
    for (var i = 35; i <= 150; i++) {
      this.weightOption.push({
        label: i + "kg / " + (i / 2.2046).toFixed(2) + "lb",
        value: i
      });
    }
    for (var i = 18; i <= 80; i++) {
      this.ageOption.push({ label: i, value: i });
    }
    this.country = this.lang == "en" ? country_en : country_zh;
    this.countryOption = setCountryLang();
  },
  methods: {
    onUnameInput(val) {
      this.unameL = computeLength(val);
    },
    onJobInput(val) {
      this.jobL = computeLength(val);
    },
    onSelectChange(data) {
      //工作城市
      if (data.id == "work") {
        this.workCityOption = [];
        this.$refs.work_city.label = "";
        this.step1.work_city = "";
        //有省的国家
        if (this.country[data.index].State) {
          this.country[data.index].State.map((elem, index, arr) => {
            this.workCityOption.push({
              label: elem["-Name"],
              value: elem["-Code"]
            });
          });
          //只有城市的国家
        } else if (this.country[data.index].StateOnly) {
          this.country[data.index].StateOnly.City.map((elem, index, arr) => {
            this.workCityOption.push({
              label: elem["-Name"],
              value: elem["-Code"]
            });
          });
        } else {
          //没有省也没有城市的国家
          this.workCityOption.push({
            label: this.country[data.index]["-Name"],
            value: this.country[data.index]["-Code"]
          });
        }
        //出生城市
      } else if (data.id == "birth") {
        this.birthCityOption = [];
        this.$refs.city.label = "";
        this.step1.city = "";
        //有省的国家
        if (this.country[data.index].State) {
          this.country[data.index].State.map((elem, index, arr) => {
            this.birthCityOption.push({
              label: elem["-Name"],
              value: elem["-Code"]
            });
          });
          //只有城市的国家
        } else if (this.country[data.index].StateOnly) {
          this.country[data.index].StateOnly.City.map((elem, index, arr) => {
            this.birthCityOption.push({
              label: elem["-Name"],
              value: elem["-Code"]
            });
          });
        } else {
          //没有省也没有城市的国家
          this.birthCityOption.push({
            label: this.country[data.index]["-Name"],
            value: this.country[data.index]["-Code"]
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.step1 {
  .prompt-error {
    display: inline-block;
    vertical-align: middle;
    width: 100px;
    white-space: nowrap;
  }
  .info-item,
  .show-item {
    padding: 8px 0;
    line-height: 32px;
    div:first-child {
      i {
        margin-right: 5px;
      }
    }
  }
  .info-item {
    width: 52%;
    margin: 0 auto;
  }
  .show-item {
    width: 80%;
    margin: 0 30px;
  }
}
.icon-success {
  .icon-sprite(20px, 20px, -679px, -368px);
}
.icon-error {
  .icon-sprite(20px, 20px, -711px, -367px);
}
.icon-success,
.icon-error {
  margin: 6px;
}
.icon-famale {
  .icon-sprite(20px, 26px, -679px, -317px);
}
.icon-male {
  .icon-sprite(20px, 26px, -711px, -317px);
}
.icon-card {
  .icon-sprite(26px, 20px, -577px, -323px);
}
.icon-gender {
  .icon-sprite(26px, 20px, -577px, -364px);
}
.icon-date {
  .icon-sprite(26px, 20px, -577px, -404px);
}
.icon-height {
  .icon-sprite(26px, 27px, -577px, -445px);
}
.icon-weight {
  .icon-sprite(26px, 22px, -577px, -492px);
}
.icon-income {
  .icon-sprite(26px, 22px, -577px, -534px);
}
.icon-location {
  .icon-sprite(26px, 22px, -577px, -577px);
}
.icon-time {
  .icon-sprite(26px, 22px, -631px, -320px);
}
.icon-building {
  .icon-sprite(26px, 22px, -631px, -364px);
}
.icon-job {
  .icon-sprite(26px, 26px, -631px, -408px);
}
.icon-marry {
  .icon-sprite(26px, 26px, -631px, -448px);
}
.icon-faith {
  .icon-sprite(26px, 26px, -631px, -490px);
}
.icon-wine {
  .icon-sprite(26px, 22px, -631px, -539px);
}
.icon-smoke {
  .icon-sprite(26px, 22px, -629px, -580px);
}
.icon-child {
  .icon-sprite(26px, 22px, -631px, -625px);
}
</style>
<style lang="less">
.step1 {
  position: relative;
  .el-input input {
    font-size: 12px;
    height: 32px;
  }
  .el-input__inner,
  .el-input__icon {
    line-height: 32px;
  }
  .el-input--suffix .el-input__inner,
  .el-range-editor.el-input__inner {
    height: 32px;
  }
}
</style>

