# Quy tắc UTM cho các kênh của Zoe

Bộ quy tắc này áp dụng cho mọi link Zoe đăng ở: **Substack**, **Learning Library**, **Buy Me a Coffee** và **mạng xã hội (LinkedIn, YouTube, Facebook)**.
**Vì sao cần UTM.** Link đăng từ app (LinkedIn, Substack, email) thường không gửi referrer, nên lượt bấm rơi vào `(direct) / (none)`. Mọi bài trông như nhau trong báo cáo nên không so sánh được. Giá trị gõ tự do (`LinkedIn`, `linkedin.com`, `Linkedin`) tách một nguồn thành nhiều dòng. Vì vậy mỗi link phải nói rõ nó được đăng ở đâu, cho chiến dịch nào, và là bài nào, với giá trị không bao giờ đổi.

```text
LinkedIn / Facebook / YouTube / email
        │  (UTM)
        ▼
Learning Library ───(UTM)───► Substack ───(UTM)───► Buy Me a Coffee
   GA4 property A              GA4 property B
        │                            │
        └──────► BigQuery ◄──────────┘
```

## 1. Nguyên tắc chung

1. **Viết thường, không dấu, không khoảng trắng.** GA4 phân biệt hoa thường: `LinkedIn` và `linkedin` là hai nguồn khác nhau.
2. **Dùng dấu gạch ngang `-`** để nối từ trong campaign, content (cùng kiểu với đường dẫn URL). Không dùng gạch dưới hay khoảng trắng. `learn-ai-from-0` và `learn_ai_from_0` là hai giá trị khác nhau trong GA4, nên không được viết lẫn hai kiểu.
3. **Chỉ dùng mã có trong bảng.** Mã mới phải được thêm vào bảng trước khi tạo link.
4. **Không đổi mã đã dùng.** Đổi mã làm đứt lịch sử dữ liệu của kênh đó.
5. **`utm_source` luôn là nền tảng thật** (`linkedin`, `youtube`...). **`utm_medium` chỉ dùng các giá trị GA4 nhận diện** (`social`, `video`, `email`, `referral`), vì GA4 dựa vào medium để xếp kênh. Chi tiết bài đăng nằm ở `utm_campaign` và `utm_content`.
6. **Medium của link organic không được chứa `cp`, `ppc` và không bắt đầu bằng `paid`.** GA4 sẽ xếp nhầm vào quảng cáo trả tiền.
7. **Không gắn UTM cho link nội bộ** (từ trang này sang trang khác trong cùng một site). UTM làm mở phiên mới và ghi đè nguồn thật.
8. **Một link, một nơi đăng.** Không dùng lại cùng một link đã gắn UTM ở kênh khác.
9. **Tạo link bằng công cụ** ([`tools/utm-builder.html`](../tools/utm-builder.html)), không gõ tay.

## 2. Bốn tham số

| Tham số | Bắt buộc | Ý nghĩa | Ví dụ |
|---|---|---|---|
| `utm_source` | có | Nền tảng nơi link được đăng | `linkedin` |
| `utm_medium` | có | Loại kênh, chỉ dùng giá trị GA4 nhận diện (mục 3) | `social` |
| `utm_campaign` | không | Chiến dịch hoặc tuyến bài. Bài không thuộc tuyến nào thì để trống | `learn-ai-from-0` |
| `utm_content` | nên có | Vị trí và tiêu đề ngắn (xem mục 4) | `caption-claude-cowork` |

Không dùng `utm_term`. Sản phẩm Buy Me a Coffee đã nằm sẵn trong đường dẫn đích (`/e/<mã>`), nên không cần tham số riêng cho sản phẩm.

## 3. Nguồn và medium theo kênh

| Kênh | `utm_source` | `utm_medium` | Dùng khi |
|---|---|---|---|
| LinkedIn | `linkedin` | `social` | Bài đăng, comment, link ở profile |
| YouTube | `youtube` | `video` | Link trong mô tả video, comment ghim |
| Facebook | `facebook` | `social` | Bài đăng ở Facebook group, comment, trang cá nhân |
| Substack | `substack` | `email` | Link trong bài viết, email hoặc Notes của Substack dẫn sang Library hoặc Buy Me a Coffee |
| Learning Library | `learning-library` | `referral` | Link từ site sang Substack hoặc Buy Me a Coffee. Gắn **tự động bằng code**, xem mục 5 |
| Buy Me a Coffee | `buymeacoffee` | `referral` | Link từ trang Buy Me a Coffee dẫn sang Library hoặc Substack |

Vì sao medium chỉ dùng `social`, `video`, `email`, `referral`: GA4 xếp kênh mặc định theo medium và chỉ nhận diện các giá trị này. Một medium lạ (ví dụ `linkedin-zoe`) có thể rơi vào **Unassigned** và mất khỏi báo cáo kênh. Mỗi nền tảng chỉ có một tài khoản nên không cần thêm tên tài khoản vào medium.

Kênh chưa dùng (thêm khi cần, theo mẫu): Threads (`threads` / `social`), email khác (`email` / `email`).

## 4. Campaign và content

**`utm_campaign`**: tên tuyến bài hoặc chiến dịch, dạng `ten_ngan_gon`. Mã cố định:

| Campaign | Dùng cho |
|---|---|
| `bmc-shop` | Link bán sản phẩm ở Buy Me a Coffee, đặt ở Substack, LinkedIn, YouTube, Facebook. Thẻ resource trên Library dùng `resource_card` (mục 5) |
| `learn-ai-from-0` | Tuyến bài "Học AI từ 0" |

Tuyến bài mới thì thêm một dòng vào bảng này trước. Campaign của các link tự động từ Library nằm ở mục 5, không lặp lại ở đây.

**`utm_content`**: định dạng `<vị trí>-<tiêu đề>`. Luôn ghi vị trí, kể cả link trong thân bài. Tiêu đề là tên ngắn của bài, video hoặc sản phẩm, tối đa 5 đến 6 từ. Không ghi loại nội dung.

| Vị trí | Ý nghĩa | Ví dụ |
|---|---|---|
| `caption` | Link trong thân bài hoặc caption (dùng chung cho LinkedIn, YouTube, Substack) | `caption-claude-cowork` |
| `group-data-vietnam` | Bài đăng trong Facebook group "Data Vietnam" (ví dụ, thay bằng group thật). Mỗi group một dòng, dạng `group-<mã group>` | `group-data-vietnam-claude-cowork` |
| `<mã resource>` | Link tự động từ thẻ resource của Library: `utm_content` là mã resource (`resource_id`), không ghi vị trí | `tm-data-analysis` |
| `bio` | Link cố định ở profile (không cần tiêu đề) | `bio` |
| `menu` | Link ở menu điều hướng của Substack, dẫn ra ngoài Substack (cố định, hiện ở mọi trang) | `menu-learning-library` |
| `sidebar` | Link ở thanh category dọc của Substack, dẫn ra ngoài Substack. Mục dẫn sang chuyên mục khác của Substack là link nội bộ, không gắn UTM (nguyên tắc 7) | `sidebar-learning-library` |
| `description` | Link trong mô tả video | `description-claude-cowork` |
| `cmt` | Link trong comment | `cmt-doodle-explainer-kit` |

Vị trí mới thì thêm một dòng vào bảng này trước.

## 5. Link trên Learning Library (website tự gắn UTM)

Các link đi ra từ website Learning Library **không cần bạn tự gắn UTM**. Website tự thêm UTM vào link khi trang tải. Bảng này cho biết link nào mang UTM gì, để bạn đọc báo cáo.

| Khách bấm vào | Đi tới | `utm_source` | `utm_medium` | `utm_campaign` | `utm_content` | Trạng thái |
|---|---|---|---|---|---|---|
| Logo đầu trang | Substack | `learning-library` | `referral` | `header` | (trống) | Đã chạy |
| Nút ở banner | Substack | `learning-library` | `referral` | `banner` | (trống) | Đã chạy |
| Icon ở chân trang | Substack | `learning-library` | `referral` | `footer` | (trống) | Đã chạy |
| Thẻ resource trỏ tới Substack | Substack | `learning-library` | `referral` | `resource_card` | mã resource | Đã chạy |
| Thẻ resource trỏ tới Buy Me a Coffee | Buy Me a Coffee | `learning-library` | `referral` | `resource_card` | mã resource | Đã chạy |
| Thẻ sản phẩm trong banner "Tools made by Zoe" | Buy Me a Coffee | `learning-library` | `referral` | `tools-banner` | mã resource | Đã chạy |
| Thẻ bài viết trong "Popular posts from my blog" | Substack | `learning-library` | `referral` | `blog_card` | mã bài (`claude-features`, `input-black-box-output`, `google-analytics-dashboard`) | Đã chạy |
| Link "About Zoe" trên menu đầu trang | Substack (trang giới thiệu) | `learning-library` | `referral` | `about_link` | (trống) | Đã chạy |
| Icon cốc cà phê ở chân trang (ủng hộ) | Buy Me a Coffee | `learning-library` | `referral` | `footer` | `donate-button` | Đã chạy |
| Nút "Visit the shop" trong banner | Buy Me a Coffee | `learning-library` | `referral` | `tools-banner` | `shop-button` | Đã chạy |

Với 4 link đi Substack, `utm_campaign` cho biết khách bấm ở đâu trên Library, và giá trị này trùng với `cta_location` của event `cta_substack_click`. Nhờ đó cùng một vị trí hiện cùng tên ở cả hai property GA4.

### Link dẫn tới khóa học TM (Tomorrow Marketers)

Mọi link tới `tomorrowmarketers.org` **theo quy tắc của TM**, không theo bảng ở mục 3 và 4, vì TM dùng bộ này để nhận ra người giới thiệu:

| Tham số | Giá trị |
|---|---|
| `utm_source` | `referral` |
| `utm_medium` | `service` |
| `utm_campaign` | `hct` (mã của Zoe, giữ như link cũ) |
| `utm_content` | `<kênh>-<tên>`: kênh đặt link và tên bài hoặc resource |

Ví dụ `utm_content`:

| Nơi đặt link | `utm_content` |
|---|---|
| Thẻ resource trên Learning Library (tự động từ `resource_id`) | `learning-library-tm-data-analysis` |
| Bài Substack | `substack-claude-cowork` |
| Bài LinkedIn | `linkedin-claude-cowork` |
| Mô tả video YouTube | `youtube-claude-cowork` |
| Facebook group (ví dụ group `data-vietnam`) | `facebook-group-data-vietnam-claude-cowork` |
| Menu hoặc sidebar của Substack | `substack-menu`, `substack-sidebar` |

Ví dụ link đầy đủ: `https://www.tomorrowmarketers.org/data-analysis-course?utm_source=referral&utm_medium=service&utm_campaign=hct&utm_content=substack-claude-cowork`

Với link TM, `utm_content` ghi **kênh trước, tên sau**, không dùng tiền tố vị trí (`caption`, `bio`...) của mục 4. Mã `hct` không dùng cho link tới nơi khác ngoài TM.

## 6. Ví dụ link hoàn chỉnh

| Tình huống | Link |
|---|---|
| Bài kiến thức trên LinkedIn dẫn tới một bài Substack | `https://zoedatalens.substack.com/p/claude-cowork?utm_source=linkedin&utm_medium=social&utm_campaign=learn-ai-from-0&utm_content=caption-claude-cowork` |
| Link trong mô tả video YouTube dẫn tới sản phẩm Buy Me a Coffee | `https://buymeacoffee.com/zoedatalensai/e/582024?utm_source=youtube&utm_medium=video&utm_campaign=bmc-shop&utm_content=description-doodle-explainer-kit` |
| Link ở profile LinkedIn dẫn tới Library | `https://tuhoang3112.github.io/zoe-learning-library/?utm_source=linkedin&utm_medium=social&utm_content=bio` |
| Bài Substack dẫn tới trang shop Buy Me a Coffee | `https://buymeacoffee.com/zoedatalensai/extras?utm_source=substack&utm_medium=email&utm_campaign=bmc-shop&utm_content=caption-doodle-explainer-kit` |

## 7. Kiểm tra trước khi đăng link

- [ ] Mở link trong cửa sổ ẩn danh: trang tải được và UTM vẫn còn trên thanh địa chỉ.
- [ ] Trong GA4 **Realtime**, lượt truy cập hiện đúng source / medium.
- [ ] Giá trị nằm trong các bảng ở trên.
- [ ] Link không bị công cụ rút gọn làm mất phần UTM.
- [ ] Sau khoảng một tuần, kiểm tra báo cáo **Traffic acquisition**: các lượt từ UTM phải rơi vào Organic Social, Organic Video, Email hoặc Referral. Nếu thấy **Unassigned**, kiểm tra lại medium đã đúng bảng mục 3 chưa.

## 8. Việc còn lại để áp dụng

- [ ] Gắn Measurement ID của stream GA4 mới vào Page Settings của Buy Me a Coffee.
- [ ] Gắn lại UTM cho các link Buy Me a Coffee đang đặt trần trong bài Substack.

## 9. Dữ liệu nằm ở đâu

| Câu hỏi | Xem ở đâu |
|---|---|
| Kênh nào đưa nhiều khách nhất? | GA4 → Reports → Acquisition → Traffic acquisition |
| Bài nào đưa nhiều khách nhất? | Cùng báo cáo, thêm cột `Session manual ad content` |
| Vị trí nào trên Library đưa khách sang Substack? | Property Substack: `utm_campaign = header / banner / footer / resource_card` |
| Kênh nào mang lại người đăng ký? | Property Substack: key event `sign_up` theo source / medium |

Phân tích chi tiết bằng dữ liệu thô (xuất GA4 sang BigQuery, mỗi property một dataset):

```sql
-- Sessions theo giá trị UTM (xuất GA4 sang BigQuery)
SELECT
  collected_traffic_source.manual_source        AS utm_source,
  collected_traffic_source.manual_medium        AS utm_medium,
  collected_traffic_source.manual_campaign_name AS utm_campaign,
  COUNT(DISTINCT CONCAT(
    user_pseudo_id, '-',
    CAST((SELECT value.int_value FROM UNNEST(event_params)
          WHERE key = 'ga_session_id') AS STRING)
  )) AS sessions
FROM `PROJECT.analytics_XXXXXXXXX.events_*`
WHERE event_name = 'session_start'
  AND collected_traffic_source.manual_source IS NOT NULL
GROUP BY 1, 2, 3
ORDER BY sessions DESC;
```

## 10. Giới hạn đã biết

- **Email và app.** Không có UTM thì lượt bấm từ email newsletter và app điện thoại bị tính là direct. UTM là cách đáng tin duy nhất để quy nguồn.
- **Hai property, không có user ID chung.** Người đi từ Library sang Substack là người dùng mới ở property thứ hai. Hai bên nối với nhau bằng tên campaign, không phải bằng người.
- **Substack hạn chế GTM.** Chỉ chạy được tag Google và trigger có sẵn (custom HTML, biến JavaScript tùy chỉnh và pixel không phải của Google bị chặn), nên event trên site bị giới hạn ở những gì trigger gốc bắt được.
- **Hành vi chỉ ước lượng.** UTM cho biết khách đến từ đâu, không cho biết họ có thích nội dung hay không. Độ sâu cuộn và thời gian đọc được dùng làm chỉ số thay thế.
