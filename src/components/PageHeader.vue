<template>
  <el-row type='flex' justify='center' id='site-header'>
    <el-col :span='4' class='banner'>
      بنر
    </el-col>
    <el-col :span='4'>
    </el-col>
    <el-col class='menu active' :span='2'>
      جدید
    </el-col>
    <el-col class='menu' :span='2'>
      ویرایش
    </el-col>
    <el-col class='menu' :span='2'>
      حذف
    </el-col>
    <el-col class='menu' :span='2'>
      نمایش
    </el-col>
    <el-col class='menu' :span='2'>
      لیست
    </el-col>
  </el-row>
</template>

<script>
export default {
}
</script>

<style>
#site-header {
  background-color: #20A0FF;
  height: 80px;
  margin-bottom: 15px;
}

#site-header .banner {
  font-size: 48px;
  display: flex;
  align-items: center;
}

#site-header .menu {
  display: flex;
  justify-content: center;
  align-items: center;
}

#site-header .menu:hover {
  cursor: pointer;
  color: #666;
}

#site-header .menu.active {
  font-weight: bold;
  border-bottom: 3px solid #ccc;
}
</style>
