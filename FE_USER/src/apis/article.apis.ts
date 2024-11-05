import httpRequest from "~/constants/httpRequest";
import { Article } from "~/types/article.type";
import { SuccessResponse } from "~/types/utils.type";

const articleApi = {
  allArticle : (params) => httpRequest.get<SuccessResponse<Article>,any>(`/api/article?${new URLSearchParams(params)}`),
  getArticleHome : () => httpRequest.get<SuccessResponse<Article>,any>(`/api/article/home`),
  detailArticle : (id) => httpRequest.get<SuccessResponse<Article>,any>(`/api/article/${id}`),
  relatedArticle : (id) => httpRequest.get<SuccessResponse<Article>,any>(`/api/article/relatedArticle?categoryId=${id}`),
}
export default articleApi;