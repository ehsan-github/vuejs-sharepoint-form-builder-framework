// @flow

export default {
    template: `
        <el-row type='flex' justify='center' class='site-header'>
            <el-col :span='4' class='banner'>
                بنر
            </el-col>
            <el-col :span='4'>
            </el-col>
            <el-col class='menu menu-active' :span='2'>
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
    `
}
