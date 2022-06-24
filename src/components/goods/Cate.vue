<template>
    <div>
       <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域  -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!--表格  -->
        <tree-table class="treeTable" :data="catelist" :columns="columns"
         :selection-type="false" :expand-type="false"
         show-index index-text="#" :show-row-hover="false" 
         border>
         <!-- 是否有效      插槽slot -->
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" 
                 v-if="scope.row.cat_deleted === false"
                 style="color:lightgreen"
                 ></i>
                <i class="el-icon-error" v-else  style="color:red"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
             <template slot="opt" slot-scope="scope">
                 <el-button type="primary" icon="el-icon-edit"
                  size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
                <el-button  type="danger" icon="el-icon-delete"
                 size="mini" @click="removeEditCateDialog(scope.row.cat_id)">删除</el-button>
            </template>
         </tree-table>
      
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

    </el-card>

    <!-- 添加分类的对话框 -->
   <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%"
    @close="addCateDialogClosed"
    >
    <!-- 添加f分类的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules"
         ref="addCateFormRef" label-width="100px" >
            <el-form-item label="分类名称:" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:">
                <!-- options:用来指定数据源 -->
                <!-- props用来配置对象 -->
                 <el-cascader
                    props.expandTrigger="hover"
                    :options="parentCateList"
                    :props="cascaderProps"
                    v-model="selectedKeys"
                    @change="parentCateChanged"
                    clearable
                     props.checkStrictly
                >
                </el-cascader>
            </el-form-item>
           
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
    title="编辑信息"
    :visible.sync="editDialogVisible"
    width="50%"
    >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 删除 -->






    </div>
</template>

<script>
export default {
    data(){
        return{
            // 查询条件
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类的数据列表，默认为空
            catelist:[],
            // 
            total:0,
            // weitable指定列的定义
            columns:[
                {
                label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    // 表示，将当前列定义为模板列
                    type:'template',
                    // 表示当前这一列使用模板名称
                    template:'isok'
                },
                {
                    label:'排序',
                    // 表示，将当前列定义为模板列
                    type:'template',
                    // 表示当前这一列使用模板名称
                    template:'order'
                    

                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
                }
            ],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible:false,
            // 
            addCateForm:{
                // 将要添加的分类的名称
                cat_name:'',
                // 父级分类id
                cat_pid:0,
                // 分类当前层级,默认要添加的1级分类
                cat_level:0,

            },
            // 添加分类表单的验证规则对象
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 
            editForm:{},
            // 
            editDialogVisible: false,
            // 父级分类的列表
            parentCateList:[],
            // 指定级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 选中的父级分类的Id数组
            selectedKeys:[]

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类数据
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.querInfo})

            if(res.meta.status!== 200){
                return this.$message.error('获取商品分类失败')
            }

            console.log(res.data);
            // 把数据列表赋值给catelist
            this.catelist = res.data.result
            this.total = res.data.total
            // this.$message.success("获取商品分类成功")
        },
        // 监听pagesize改变
        handleSizeChange(newSize){
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum改变
        handleCurrentChange(newPage){
            this.querInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击按钮,展示添加父级的对话框
        showAddCateDialog(){
            // 先获取父级元素分类的数据列表
            this.getParentCateList()
            // 再展示出对话框
            this.addCateDialogVisible = true
        },
        // 获取父级分类数据列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})

            if(res.meta.status!==200){
                return this.$message.error("获取父级元素数据失败")
            }

            console.log(res.data);
            this.parentCateList = res.data
        },
        parentCateChanged(){
            console.log(this.selectedKeys);
            // 如果selectedkEY数组中的length大于0,证明选中的父级分类
            // 反之,就说明没有选中任何父级符合
            if(this.selectedKeys.length > 0){
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[
                    this.selectedKeys.length - 1
                ]
                // 当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                 // 父级分类的id
                this.addCateForm.cat_pid = 0
                // 当前分类的等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        // 添加新的分类
         addCate(){
            // console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)

                if(res.meta.status !== 201){
                    return this.$message.error("添加分类失败!")
                }

                this.$message.success('添加分类成功!')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 编辑分类
        async showEditCateDialog(id){
            // // console.log(id);
            // const {data:res} = await this.$http.put('categories/'+id);

            // if(res.meta.status !== 200){
            //     return this.$message.error("更新失败")
            // }
            // this.cat_name = res.data;
            // this.addCateDialogVisible = true;
        },
        removeEditCateDialog(){

        }


    }
}
</script>

<style scoped>
.treeTable{
    margin-top: 15px;
    margin-bottom: 15px;
}
.el-pagination{
    margin: 0 auto;
}
.el-cascader{
    width: 100%;
}
</style>