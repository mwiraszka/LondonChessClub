export { ArticlesService } from './articles.service';
export { Article, newArticleFormTemplate } from './types/article.model';

export { ArticleEditorScreenComponent } from './article-editor-screen/article-editor-screen.component';
export { ArticleEditorScreenModule } from './article-editor-screen/article-editor-screen.module';
export * as ArticleEditorScreenActions from './article-editor-screen/store/article-editor-screen.actions';
export { ArticleEditorScreenEffects } from './article-editor-screen/store/article-editor-screen.effects';
export * as ArticleEditorScreenSelectors from './article-editor-screen/store/article-editor-screen.selectors';
export { reducer as articleEditorScreenReducer } from './article-editor-screen/store/article-editor-screen.reducer';
export { ArticleEditorScreenState } from './article-editor-screen/store/article-editor-screen.state';

export { ArticleListScreenComponent } from './article-list-screen/article-list-screen.component';
export { ArticleListScreenModule } from './article-list-screen/article-list-screen.module';
export * as ArticleListScreenActions from './article-list-screen/store/article-list-screen.actions';
export { ArticleListScreenEffects } from './article-list-screen/store/article-list-screen.effects';
export * as ArticleListScreenSelectors from './article-list-screen/store/article-list-screen.selectors';
export { reducer as articleListScreenReducer } from './article-list-screen/store/article-list-screen.reducer';
export { ArticleListScreenState } from './article-list-screen/store/article-list-screen.state';
