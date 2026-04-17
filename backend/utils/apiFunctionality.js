class apiFunctionality{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{};
        console.log(keyword);
        this.query=this.query.find({...keyword});
        //console.log(this.query);
        return this
    }
    filter(){
        const queryCopy = {...this.queryStr};
        const removeFields = ["limit","page","keyword"];
        removeFields.forEach(element => delete queryCopy[element]);
        console.log(queryCopy);
        this.query=this.query.find(queryCopy);
        return this;

    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip1= resultPerPage*(currentPage-1);
        this.query=this.query.limit(resultPerPage).skip(skip1);
        return this;
    }
}
export default apiFunctionality;