# Hướng dẫn tracking: gắn tag, tạo event, kiểm tra

Tài liệu từng bước để làm lại mọi việc tracking mà không cần nhớ. Quy tắc và danh sách event nằm ở [`tracking-rules.md`](tracking-rules.md) và [`tracking-plan.md`](tracking-plan.md). Quy tắc UTM nằm ở [`utm-rules.md`](utm-rules.md).

## 1. Bức tranh tổng thể

```text
Khách bấm / cuộn / đăng ký
        │
        ▼
Website đẩy một event vào Data Layer        (Library: file analytics.js)
        │
        ▼
GTM bắt event: Trigger → Tag → gửi sang GA4
        │
        ▼
GA4 ghi event + tham số → xem ở Realtime / Events / Reports → BigQuery
```

Substack không có code của bạn: nó tự đẩy `sign_up` vào Data Layer, GTM chỉ việc bắt. Buy Me a Coffee không có GTM: chỉ dán mã GA4 vào ô Google Analytics ID.

## 2. Những địa chỉ cần nhớ

| Việc | Vào đâu |
|---|---|
| Xem số liệu, tạo custom dimension, đánh dấu key event | https://analytics.google.com |
| Tạo tag, trigger, publish | https://tagmanager.google.com |

| Kênh | GA4 property | GTM container |
|---|---|---|
| Learning Library | Zoe Learning Library | Learning Library (`GTM-M8CHLXMT`) |
| Buy Me a Coffee | Cùng property Zoe Learning Library, luồng dữ liệu riêng tên "Buy Me a Coffee" | Không có GTM |
| Substack | Zoe Substack | zoedatalens.substack.com (`GTM-WNCRKDD8`) |

Luôn nhìn tên property ở góc trên bên trái GA4 trước khi sửa gì, vì hai property trông giống nhau.

## 3. Thiết lập từ đầu cho một site mới (làm một lần)

Dùng khi bạn có một site mới (ví dụ shop riêng sau này) và muốn tracking giống Library. Làm lần lượt từ phần A đến F.

### Phần A. Tạo GA4
1. https://analytics.google.com → **Admin** (bánh răng, góc dưới trái) → **Create → Property**. Đặt tên, múi giờ Việt Nam, đơn vị tiền tệ. Nếu site mới thuộc cùng dự án với Library và bạn muốn gộp số liệu, bỏ qua bước này và chỉ thêm luồng dữ liệu vào property có sẵn (như Buy Me a Coffee).
2. **Data streams → Add stream → Web**: nhập địa chỉ site, đặt tên luồng, để **Enhanced measurement** bật (đo xem trang, cuộn, click ra ngoài tự động). Bấm **Create stream**.
3. Sao chép **Measurement ID** (dạng `G-XXXXXXXXXX`) ở góc trên bên phải trang chi tiết luồng.
4. Nên chỉnh ngay: Admin → Data collection and modification → **Data retention** → chọn **14 months** (mặc định chỉ 2 tháng cho dữ liệu chi tiết).

### Phần B. Tạo GTM
1. https://tagmanager.google.com → **Create Account**: đặt tên account, chọn quốc gia.
2. **Container name**: tên site hoặc tên miền. **Target platform**: **Web**. Bấm Create, đồng ý điều khoản.
3. GTM hiện hộp "Install Google Tag Manager" với hai đoạn code. Ghi lại mã container dạng **GTM-XXXXXXX** (mã này cũng thấy ở đầu trang Workspace).

### Phần C. Dán code vào site
1. **Đoạn 1** (có chữ `<script>`) dán trong thẻ `<head>`, càng cao càng tốt. **Đoạn 2** (có chữ `<noscript>`) dán ngay sau thẻ `<body>`.
2. Với Library, cả hai đoạn nằm trong [`landing-page/index.html`](../landing-page/index.html), phần có chú thích "Google Tag Manager". Đoạn script ở đó được bọc điều kiện để không chạy trên `localhost`.
3. Đưa lên site thật (push lên GitHub, đợi deploy).

### Phần D. Tạo Google tag trong GTM
1. Vào container → **Workspace** → **Variables → New** → loại **Constant**. Tên `GA4 Measurement ID`, giá trị là mã `G-...` ở phần A3. Save.
2. **Tags → New** → loại **Google Tag**. Tag ID: chọn biến `{{GA4 Measurement ID}}`. Triggering: **Initialization - All Pages**. Đặt tên `Google Tag | GA4 | Page view`. Save. Tag này lo `page_view` và các event tự động của GA4.
3. Bấm **Preview**, nhập địa chỉ site thật, Connect. Trong Tag Assistant, tag vừa tạo phải nằm ở **Tags Fired** của event "Initialization".
4. **Submit** (đặt tên "Add Google tag") rồi **Publish**.
5. Vào GA4 → **Reports → Realtime**, mở site ở tab khác: phải thấy lượt truy cập và `page_view`.

### Phần E. Tạo event đầu tiên
Làm theo mục 4 (Bước A đến G). Nếu site mới là site tĩnh như Library, bạn sao chép mẫu `analytics.js` (hàm `pushDataLayer`) để dùng lại cách đẩy event vào Data Layer.

### Phần F. Việc làm sau khi có dữ liệu
- **Đánh dấu key event** cho kết quả thật (xem mục 4, Bước F4).
- **Tạo custom dimension** cho các tham số muốn xem trong báo cáo (Bước F3).
- **Nối BigQuery** nếu cần phân tích dữ liệu thô: Admin → Product links → **BigQuery links** → Link, chọn dự án và xuất hằng ngày.
- **Search Console:** thêm và xác minh site, để xem từ khóa người dùng tìm.
- **Ghi lại** site mới vào bảng kênh ở [`tracking-rules.md`](tracking-rules.md) mục 1 và đi theo checklist "Adding a new channel" trong đó.

### Nền tảng không cho dán code
- **Substack:** có ô nhập Google Tag Manager trong phần cài đặt của Substack (đường vào có thể đổi theo thời gian, tìm mục tích hợp hoặc analytics). Bạn dán mã **GTM-XXXXXXX** vào đó, rồi làm tag trong container như bình thường. Chỉ chạy được tag Google và trigger có sẵn (xem mục 6).
- **Nền tảng chỉ có ô Google Analytics ID** (như Buy Me a Coffee): dán mã `G-...` của luồng dữ liệu, không cần GTM (xem mục 7).

## 4. Thêm một event mới cho Learning Library

Ví dụ: bạn muốn đo lượt bấm nút "Chia sẻ", đặt tên `share_click`.

### Bước A. Đặt tên (5 phút)
- Tên viết thường, nối bằng `_`, ví dụ `share_click`. Không dùng tên GA4 đã có sẵn (`click`, `scroll`, `page_view`).
- Quyết định tham số kèm theo (ví dụ `resource_id`). Không đưa thông tin cá nhân vào tham số.
- Ghi vào bảng ở [`tracking-plan.md`](tracking-plan.md) trước khi code.

### Bước B. Thêm code
1. Mở [`landing-page/js/analytics.js`](../landing-page/js/analytics.js), thêm một hàm đẩy event vào Data Layer, theo mẫu các hàm có sẵn:
   ```js
   function trackShare(resource) {
     pushDataLayer(Object.assign({ event: "share_click" }, resourceParams(resource)));
   }
   ```
2. Gọi hàm đó ở nơi khách bấm, trong [`app.js`](../landing-page/js/app.js).
3. Chạy site trên máy (`python -m http.server 8000` trong thư mục `landing-page`). GTM không nạp trên `localhost`, nên muốn test thật thì mở `http://localhost:8000/?gtm=on`.

### Bước C. Tạo biến, trigger, tag trong GTM (container Learning Library)
Vào https://tagmanager.google.com → chọn container **Learning Library** → tab **Workspace**.

1. **Biến cho mỗi tham số mới** (bỏ qua nếu tham số đã có): Variables → User-Defined Variables → New → loại **Data Layer Variable**, đặt tên `dlv - <tham số>`, ô Data Layer Variable Name gõ đúng tên tham số.
2. **Trigger**: Triggers → New → loại **Custom Event**, Event name gõ đúng `share_click`, đặt tên `CE - share_click`.
3. **Tag**: Tags → New → loại **Google Analytics: GA4 Event**:
   - Measurement ID: chọn biến `{{GA4 Measurement ID}}`.
   - Event Name: `share_click`.
   - Event Parameters: thêm từng tham số, giá trị là biến `{{dlv - ...}}` tương ứng.
   - Triggering: chọn `CE - share_click`.
   - Đặt tên `GA4 Event | share_click`. Mỗi event một tag, không tạo tag cho từng resource.

### Bước D. Kiểm tra bằng Preview (không bỏ qua)
1. Bấm **Preview** (góc trên bên phải), nhập địa chỉ site thật `https://tuhoang3112.github.io/zoe-learning-library/`, Connect.
2. Ở tab Library vừa mở, làm thao tác bấm nút.
3. Ở cửa sổ Tag Assistant, bấm vào event `share_click` ở cột trái: tag `GA4 Event | share_click` phải nằm ở **Tags Fired**. Nếu nằm ở **Tags Not Fired**, kiểm tra tên event và trigger.

### Bước E. Publish
1. Nếu GTM hiện hộp **Validate Container** báo lỗi, sửa hết lỗi trước (xem mục 8).
2. Bấm **Submit**, đặt tên phiên bản có nghĩa (ví dụ "Add share_click"), bấm **Publish**.
3. Vào tab **Versions** kiểm tra phiên bản mới ghi **Live**.

### Bước F. Kiểm tra trong GA4
1. **Ngay lập tức:** GA4 → Reports → **Realtime**. Thao tác trên site thật, sự kiện `share_click` phải hiện ở thẻ Event count by Event name.
2. **Sau khoảng 24 giờ:** Admin → Data display → **Events** → tab Recent events thấy `share_click`.
3. **Muốn xem tham số trong báo cáo:** Admin → Data display → **Custom definitions** → Create custom dimension: Dimension name = tên tham số, Scope = **Event**, Event parameter = đúng tên tham số (gõ sai một chữ là dimension trống mãi). Với tham số là con số (ví dụ `result_count`) thì tạo **Custom metric**. Dimension chỉ có dữ liệu từ lúc tạo, không áp dụng ngược.
4. **Muốn đánh dấu là chuyển đổi:** tab Recent events, bấm ngôi sao cạnh event (chỉ những event là kết quả thật, không đánh dấu event hiển thị hay lọc).

### Bước G. Lưu lại
- Xuất container về repo: GTM → Admin → Export Container (chọn phiên bản Live), lưu đè vào `gtm/library-container.json`.
- Cập nhật [`tracking-plan.md`](tracking-plan.md) nếu bước A chưa ghi đủ.

## 5. Nhập nhiều tag cùng lúc bằng file JSON

Khi file `gtm/library-container.json` có tag mới mà GTM trên web chưa có:
1. GTM → Admin → **Import Container**.
2. Chọn file JSON, chọn Workspace (Default Workspace).
3. Chọn **Merge**, rồi chọn **Overwrite conflicting tags, triggers and variables**.
4. Xem bảng xem trước: chỉ nên có Added và Modified, **0 Deleted**.
5. Bấm Confirm, rồi Preview, Submit, Publish như bước D và E.

Không chọn Overwrite (không có chữ Merge, sẽ xóa sạch container) và không chọn Rename (sẽ tạo tag trùng làm event bắn hai lần).

## 6. Substack

- Substack đã tự đẩy `sign_up` vào Data Layer khi có người đăng ký. Trigger **Custom Event** `sign_up` bắt được nó.
- Container Substack chỉ chạy được **tag Google** và **trigger có sẵn** (Click, Scroll Depth, Timer, Element Visibility, Custom Event). Custom HTML và JavaScript tùy chỉnh bị chặn.
- Kiểm tra bằng Preview ở `https://zoedatalens.substack.com`. Muốn thử `sign_up` mà không đăng ký thật, mở Console (F12) của tab Substack đang Preview và gõ `dataLayer.push({event: "sign_up"})` (Chrome có thể yêu cầu gõ `allow pasting` trước khi dán lệnh). Kết quả `false` là bình thường. Lệnh này gửi một event giả vào GA4, đừng tính nó vào số người đăng ký.
- **Trigger Timer:** mỗi trigger phải có **Event Name riêng** (`gtm.timer30`, `gtm.timer60`, `gtm.timer120`) và ô **Enable this trigger when...** không được để trống (điền `{{Page Path}} contains /p/`). Nếu không GTM báo lỗi và chặn Preview.
- Muốn `sign_up` đo được: đánh dấu key event ở property **Zoe Substack** (xem bước F4).

## 7. Buy Me a Coffee

- Chỉ có một ô: Page Settings → kéo xuống cuối → **Google Analytics** → dán Measurement ID (`G-...`) → **Save changes**. Mã đã dán là mã của luồng "Buy Me a Coffee" trong property Library.
- Sau khi lưu, trang khách có thể dùng bản cũ trong bộ nhớ đệm vài chục phút. Đợi rồi mở lại.
- Kiểm tra: mở trang ở tab ẩn danh, F12 → **Network** → ô lọc gõ `G-...` (mã của bạn) → tải lại. Có dòng trạng thái **204** là GA4 đã nhận. Không có dòng nào thì mã chưa nhúng vào trang.
- Chỉ đo được lượt xem trang, cuộn, click ra ngoài và nguồn khách (nhờ UTM). Không đo được mua hàng: số bán xem ở dashboard của Buy Me a Coffee.
- Xem riêng Buy Me a Coffee trong GA4: thêm **Add comparison** rồi chọn **Stream name**.

## 8. Gỡ lỗi nhanh

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| GTM báo "Validate Container" khi Preview | Trigger cấu hình sai (hay gặp với Timer) | Mở trigger được nêu, điền đủ các ô bắt buộc, Save |
| Tag nằm ở **Tags Not Fired** | Tên event trong code khác tên trong trigger, hoặc trigger gắn sai | So từng chữ giữa `pushDataLayer({event: ...})` và Event name của trigger |
| Event không về GA4 dù Preview thấy bắn | Chưa Publish (chỉ Preview) | Submit rồi Publish, xem tab Versions có bản Live mới chưa |
| Event có ở Realtime nhưng không ở Events | GA4 cập nhật trang Events chậm | Đợi tới 24 giờ |
| Tham số không hiện trong báo cáo | Chưa tạo custom dimension | Tạo ở bước F3, dữ liệu chỉ có từ lúc tạo |
| Số liệu có lượt lạ từ `localhost` | Chạy site trên máy khi GTM đang nạp | Từ nay GTM không nạp trên `localhost`; muốn test thì thêm `?gtm=on` |
| Nguồn khách nằm ở "Unassigned" | `utm_medium` không phải `social`, `video`, `email`, `referral` | Sửa link theo [`utm-rules.md`](utm-rules.md) |
| Buy Me a Coffee không thấy dữ liệu | Chưa lưu mã, hoặc bộ nhớ đệm, hoặc trình chặn quảng cáo | Làm theo mục 7, xem cột Status trong Network |

## 9. Những điều dễ quên

- **Không bao giờ sửa phiên bản đang Live.** Mọi thay đổi làm trong Workspace, Preview, rồi mới Publish.
- **Preview xong chưa phải xong.** Phải bấm **Submit** và **Publish**.
- **Mỗi event một tag**, không tạo tag riêng cho từng resource hay từng sản phẩm.
- **Export lại container về `gtm/`** sau mỗi lần publish để repo khớp với bản đang chạy.
- **Chỉ đánh dấu key event** cho kết quả thật: Library (`cta_substack_click`, `resource_click`), Substack (`sign_up`).
- **Library và Buy Me a Coffee chung một property.** Báo cáo mặc định cộng cả hai, nhớ lọc theo luồng khi cần số riêng.
- **Không đưa thông tin cá nhân** (email, tên) vào tham số event.
