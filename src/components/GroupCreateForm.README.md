# GroupCreateForm コンポーネント

グループを作成するためのフォームコンポーネントです。

## 使用方法

### 基本的な使用

```astro
---
import GroupCreateForm from '../components/GroupCreateForm.astro';
import { mockTeamMembers } from '../lib/mockData';

// 実際の使用時は、teamMembersStore から取得
const members = mockTeamMembers;
---

<GroupCreateForm members={members} />
```

### ページでの使用例

```astro
---
// src/pages/groups/new.astro
import Layout from '../../layouts/Layout.astro';
import GroupCreateForm from '../../components/GroupCreateForm.astro';
import { teamMembersStore } from '../../stores/groupStore';
import { loadMockData } from '../../lib/mockData';

// 開発時のモックデータ読み込み（本番では削除）
if (import.meta.env.DEV) {
  loadMockData();
}

const members = teamMembersStore.get();
---

<Layout title="新しいグループを作成">
  <GroupCreateForm members={members} />
</Layout>
```

### モーダルでの使用例

```html
<div id="create-group-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <GroupCreateForm members={members} />
  </div>
</div>

<script>
  // グループ作成成功時のイベントをリッスン
  document.addEventListener('groupCreated', (event) => {
    const { group } = event.detail;
    console.log('新しいグループが作成されました:', group);
    
    // モーダルを閉じる
    document.getElementById('create-group-modal').style.display = 'none';
    
    // デフォルトの動作（ページ遷移）を防ぐ
    event.preventDefault();
  });
</script>
```

## Props

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| members | TeamMember[] | いいえ | 選択可能なチームメンバーのリスト。空の場合、フォームは無効化されます。 |

## イベント

### groupCreated

グループが正常に作成された時に発火します。

```javascript
document.addEventListener('groupCreated', (event) => {
  const newGroup = event.detail.group;
  // newGroup: { id: string, name: string, memberIds: string[] }
});
```

## 機能

- グループ名の入力（必須）
- メンバーの複数選択（最低1人必須）
- バリデーション
- エラーメッセージ表示
- 成功時のカスタムイベント発火
- レスポンシブデザイン

## スタイリング

コンポーネントは独自のスタイルを持っていますが、以下のCSS変数でカスタマイズ可能です：

```css
:root {
  --group-form-primary-color: #4a90e2;
  --group-form-error-color: #e74c3c;
  --group-form-border-radius: 4px;
}
```

## 注意事項

- `crypto.randomUUID()` を使用してIDを生成するため、HTTPS環境またはlocalhost環境が必要です
- メンバーデータは事前に `teamMembersStore` に設定されている必要があります
- グループ作成後のページ遷移は、カスタムイベントで制御可能です 