class callback{
    functions = {};
    setFunction(id,fun){
        this.functions[id]=fun;
    }

    runFunction(id,response){
        let fun = this.functions[id];
        delete this.functions[id];
        fun(response);
    }
}

export default new callback();
