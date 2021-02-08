class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keywords = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keywords });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //remove some filds from the query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    //advanced filter for products based on price range
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultsPerPage){
      const currentPage =Number(this.query.page)||1;
      const skip=resultsPerPage*(currentPage-1);
      this.query = this.query.limit(resultsPerPage).skip(skip);
      return this;
  }
}
export default APIFeatures;
 