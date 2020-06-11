class Error {
    constructor() {
        this.errors = {}
    }
    get(field){
        if(this.errors[field]){
            return this.errors[field][0]
        }

    }
    has(field){
        if(this.errors[field]){
            return true
        }
        return  false;
    }
    any(){
       return  Object.keys(this.errors).length >0 ;
    }

    record(error){
        this.errors = error;
    }
    clearAll(){
        this.errors = {};
    }
    clear(field){
        delete this.errors[field] ;
    }
}

class Form {
    constructor(data) {
        this.originalData = data;
        for (let field in data){
            this[field] = data[field];
        }
        this.errors =new Error();
    }

    reset(){
        for (let  field in  this.originalData){
            this[field] ='';
        }
        this.errors.clearAll();
    }
    data(){
        let data={};
        for (let field in this.originalData){
            data[field] =this[field];
        }
        return data;
    }
    post(url){
        return this.submit('post' ,url);
    }
    patch(url){
        return this.submit('patch' ,url);
    }


    get(url){
        return this.submit('get' ,url);
    }


    submit(requestType, url){
        return new Promise( (resolve , reject) =>{
            axios[requestType](url , this.data())
                .then((response)=>{
                    this.onSuccess(response.data);
                    resolve(response.data);
                })
                .catch((error)=>{
                    this.onFail(error.response.data.errors);
                    reject(error.response.data.errors);
                });
        });


    }
    onSuccess(response){
            this.reset();
    }
    onFail(errors){
        this.errors.record(errors);
    }
}

new Vue({
    el: "#root",
    data: {
        form:new Form({
            name:'' ,
            description:'' ,
        })
    } ,
    methods:{
        onProjectSubmit(){
            this.form.post('/projects').then((data)=>{
            }).catch(error=>{
            });
        },
        onSucess(response){
            console.log(response);
            this.form.reset();
        }
    }
});
