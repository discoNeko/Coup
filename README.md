# Coup
game / ボードゲーム  
  
![タイトル画面](example.png)  

## TODO
### ゲーム部分
・「交換」処理の実装  
・「手札を捨てる」とき、任意の手札を選択できるようにする  
・勝敗判定  
・doubt後の手札公開、および交換  
・ゲームスピードを調整できるようにする  
### UI
・プレイ画面全般の改善  
・待機画面でのイラスト追加  
・クリック時のアニメーションなどの追加  
### バグ
・（状況）[暗殺]Ａ－＞Ｂ宣言、Ａの宣言にdoubtがかけられる、Ａが刺客を所持しておりdoubt失敗。  
このときＢがblock宣言できず、そのまま暗殺が実行される。  
