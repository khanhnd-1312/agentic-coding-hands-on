-- Fake data for LOCAL DEVELOPMENT only.
-- DO NOT run this in production.
-- Set env: SUPABASE_EXTRA_SEEDS="./seeds/dev/*.sql" to include this seed.

-- ─── Fake Auth Users ───────────────────────────────────────────────────
-- Insert into auth.users so profiles FK is satisfied.
-- The handle_new_user() trigger will auto-create a minimal profile for each,
-- but the UPSERT below overwrites it with richer test data.
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, instance_id, aud, role)
VALUES
  ('a0000001-0000-0000-0000-000000000001', 'nguyen.van.anh@sun-asterisk.com',   '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Nguyễn Văn Anh"}',      now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000002', 'tran.thi.bich@sun-asterisk.com',     '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Trần Thị Bích"}',       now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000003', 'le.hoang.cuong@sun-asterisk.com',    '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Lê Hoàng Cường"}',      now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000004', 'pham.minh.duc@sun-asterisk.com',     '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Phạm Minh Đức"}',       now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000005', 'hoang.thu.huong@sun-asterisk.com',   '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Hoàng Thu Hương"}',     now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000006', 'vu.quoc.khanh@sun-asterisk.com',     '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Vũ Quốc Khánh"}',      now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000007', 'do.thanh.lam@sun-asterisk.com',      '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Đỗ Thanh Lâm"}',        now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000008', 'bui.ngoc.mai@sun-asterisk.com',      '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Bùi Ngọc Mai"}',        now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000009', 'dang.van.nam@sun-asterisk.com',      '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Đặng Văn Nam"}',        now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('a0000001-0000-0000-0000-000000000010', 'nguyen.thi.oanh@sun-asterisk.com',   '$2a$10$fake', now(), '{"provider":"google","providers":["google"]}', '{"name":"Nguyễn Thị Oanh"}',    now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- ─── Profiles (overwrite trigger-created profiles with full test data) ─
INSERT INTO profiles (id, name, avatar_url, department_id, kudos_received_count, tim_points, title) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Nguyễn Văn Anh',   NULL, 'dd000001-0000-0000-0000-000000000001', 15, 120, 'Senior Engineer'),
  ('a0000001-0000-0000-0000-000000000002', 'Trần Thị Bích',    NULL, 'dd000001-0000-0000-0000-000000000002', 22, 180, 'Lead Designer'),
  ('a0000001-0000-0000-0000-000000000003', 'Lê Hoàng Cường',   NULL, 'dd000001-0000-0000-0000-000000000003', 8,  60,  'Product Manager'),
  ('a0000001-0000-0000-0000-000000000004', 'Phạm Minh Đức',    NULL, 'dd000001-0000-0000-0000-000000000001', 30, 250, 'Tech Lead'),
  ('a0000001-0000-0000-0000-000000000005', 'Hoàng Thu Hương',   NULL, 'dd000001-0000-0000-0000-000000000004', 12, 90,  'Marketing Manager'),
  ('a0000001-0000-0000-0000-000000000006', 'Vũ Quốc Khánh',    NULL, 'dd000001-0000-0000-0000-000000000006', 18, 140, 'QA Lead'),
  ('a0000001-0000-0000-0000-000000000007', 'Đỗ Thanh Lâm',     NULL, 'dd000001-0000-0000-0000-000000000007', 5,  40,  'DevOps Engineer'),
  ('a0000001-0000-0000-0000-000000000008', 'Bùi Ngọc Mai',     NULL, 'dd000001-0000-0000-0000-000000000005', 25, 200, 'HR Manager'),
  ('a0000001-0000-0000-0000-000000000009', 'Đặng Văn Nam',     NULL, 'dd000001-0000-0000-0000-000000000001', 10, 80,  'Frontend Developer'),
  ('a0000001-0000-0000-0000-000000000010', 'Nguyễn Thị Oanh',  NULL, 'dd000001-0000-0000-0000-000000000008', 7,  55,  'Sales Executive')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url,
  department_id = EXCLUDED.department_id,
  kudos_received_count = EXCLUDED.kudos_received_count,
  tim_points = EXCLUDED.tim_points,
  title = EXCLUDED.title;

-- ─── Kudos ─────────────────────────────────────────────────────────────
INSERT INTO kudos (id, sender_id, receiver_id, content, images, heart_count, created_at) VALUES
  ('cc000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000002',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Cảm ơn chị Bích đã thiết kế UI tuyệt vời cho dự án SAA 2025! Mọi thứ rất clean, pixel-perfect và dễ implement. Team Engineering rất appreciate sự hợp tác từ Design team 🎨'))))),
   ARRAY[]::TEXT[], 42, now() - interval '2 hours'),

  ('cc000001-0000-0000-0000-000000000002',
   'a0000001-0000-0000-0000-000000000004',
   'a0000001-0000-0000-0000-000000000003',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Anh Cường luôn là người định hướng product rõ ràng, giúp team dev không bị lạc hướng. Cảm ơn anh vì những buổi grooming chất lượng và luôn sẵn sàng giải đáp thắc mắc! 💪'))))),
   ARRAY[]::TEXT[], 38, now() - interval '5 hours'),

  ('cc000001-0000-0000-0000-000000000003',
   'a0000001-0000-0000-0000-000000000005',
   'a0000001-0000-0000-0000-000000000008',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Chị Mai đã tổ chức team building cuối năm rất tuyệt vời! Mọi người đều vui và gắn kết hơn. HR team thật sự làm việc rất tận tâm để Sun* trở thành nơi làm việc tốt nhất 🌟'))))),
   ARRAY[]::TEXT[], 35, now() - interval '1 day'),

  ('cc000001-0000-0000-0000-000000000004',
   'a0000001-0000-0000-0000-000000000006',
   'a0000001-0000-0000-0000-000000000004',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Anh Đức luôn review code rất kỹ và feedback constructive. Nhờ anh mà code quality của cả team được cải thiện đáng kể. Cảm ơn anh vì sự mentorship tuyệt vời! 🚀'))))),
   ARRAY[]::TEXT[], 28, now() - interval '1 day 3 hours'),

  ('cc000001-0000-0000-0000-000000000005',
   'a0000001-0000-0000-0000-000000000007',
   'a0000001-0000-0000-0000-000000000001',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Anh Anh đã hỗ trợ setup CI/CD pipeline rất nhanh chóng, giúp DevOps team tiết kiệm rất nhiều thời gian. Collaboration giữa Engineering và DevOps chưa bao giờ tốt như thế! ⚡'))))),
   ARRAY[]::TEXT[], 25, now() - interval '2 days'),

  ('cc000001-0000-0000-0000-000000000006',
   'a0000001-0000-0000-0000-000000000002',
   'a0000001-0000-0000-0000-000000000009',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Nam đã implement đúng 100% design cho trang Kudos Live Board. Rất ít frontend developer có thể làm pixel-perfect như vậy. Keep up the great work! 🎯'))))),
   ARRAY[]::TEXT[], 20, now() - interval '2 days 5 hours'),

  ('cc000001-0000-0000-0000-000000000007',
   'a0000001-0000-0000-0000-000000000003',
   'a0000001-0000-0000-0000-000000000006',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Cảm ơn anh Khánh và QA team đã phát hiện bug critical trước khi release. Nhờ vậy mà sản phẩm của chúng ta luôn đảm bảo chất lượng cao nhất cho khách hàng! 🔍'))))),
   ARRAY[]::TEXT[], 18, now() - interval '3 days'),

  ('cc000001-0000-0000-0000-000000000008',
   'a0000001-0000-0000-0000-000000000008',
   'a0000001-0000-0000-0000-000000000005',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Chị Hương đã viết content cho chiến dịch SAA 2025 cực kỳ ấn tượng! Số lượng engagement tăng 200% so với năm ngoái. Marketing team thật sự xuất sắc! 📈'))))),
   ARRAY[]::TEXT[], 15, now() - interval '3 days 2 hours'),

  ('cc000001-0000-0000-0000-000000000009',
   'a0000001-0000-0000-0000-000000000009',
   'a0000001-0000-0000-0000-000000000007',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Anh Lâm đã giúp optimize Docker image size giảm 60%, deploy time giảm từ 10 phút xuống còn 3 phút. DevOps skill thật sự impressive! 🐳'))))),
   ARRAY[]::TEXT[], 12, now() - interval '4 days'),

  ('cc000001-0000-0000-0000-000000000010',
   'a0000001-0000-0000-0000-000000000010',
   'a0000001-0000-0000-0000-000000000002',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Chị Bích đã thiết kế slide pitch deck cho khách hàng mới rất chuyên nghiệp. Nhờ đó mà deal đã close thành công! Design không chỉ đẹp mà còn hiệu quả trong kinh doanh 💼'))))),
   ARRAY[]::TEXT[], 10, now() - interval '5 days'),

  ('cc000001-0000-0000-0000-000000000011',
   'a0000001-0000-0000-0000-000000000004',
   'a0000001-0000-0000-0000-000000000005',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Cảm ơn chị Hương đã tổ chức workshop "Effective Communication" cho Engineering team. Kỹ năng soft skill cũng quan trọng không kém technical skill! 📢'))))),
   ARRAY[]::TEXT[], 8, now() - interval '5 days 4 hours'),

  ('cc000001-0000-0000-0000-000000000012',
   'a0000001-0000-0000-0000-000000000001',
   'a0000001-0000-0000-0000-000000000004',
   jsonb_build_object('type', 'doc', 'content', jsonb_build_array(jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', 'Anh Đức đã lead sprint retrospective rất hiệu quả. Team đã identify được root cause của nhiều vấn đề và đưa ra action items cụ thể. Leadership skill tuyệt vời! 🏆'))))),
   ARRAY[]::TEXT[], 6, now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- ─── Kudos–Hashtags ────────────────────────────────────────────────────
INSERT INTO kudos_hashtags (kudos_id, hashtag_id) VALUES
  ('cc000001-0000-0000-0000-000000000001', 'bb000001-0000-0000-0000-000000000001'),
  ('cc000001-0000-0000-0000-000000000001', 'bb000001-0000-0000-0000-000000000006'),
  ('cc000001-0000-0000-0000-000000000002', 'bb000001-0000-0000-0000-000000000003'),
  ('cc000001-0000-0000-0000-000000000002', 'bb000001-0000-0000-0000-000000000009'),
  ('cc000001-0000-0000-0000-000000000003', 'bb000001-0000-0000-0000-000000000001'),
  ('cc000001-0000-0000-0000-000000000003', 'bb000001-0000-0000-0000-000000000005'),
  ('cc000001-0000-0000-0000-000000000004', 'bb000001-0000-0000-0000-000000000007'),
  ('cc000001-0000-0000-0000-000000000004', 'bb000001-0000-0000-0000-000000000004'),
  ('cc000001-0000-0000-0000-000000000005', 'bb000001-0000-0000-0000-000000000001'),
  ('cc000001-0000-0000-0000-000000000005', 'bb000001-0000-0000-0000-000000000002'),
  ('cc000001-0000-0000-0000-000000000006', 'bb000001-0000-0000-0000-000000000004'),
  ('cc000001-0000-0000-0000-000000000006', 'bb000001-0000-0000-0000-000000000010'),
  ('cc000001-0000-0000-0000-000000000007', 'bb000001-0000-0000-0000-000000000004'),
  ('cc000001-0000-0000-0000-000000000007', 'bb000001-0000-0000-0000-000000000008'),
  ('cc000001-0000-0000-0000-000000000008', 'bb000001-0000-0000-0000-000000000006'),
  ('cc000001-0000-0000-0000-000000000008', 'bb000001-0000-0000-0000-000000000010'),
  ('cc000001-0000-0000-0000-000000000009', 'bb000001-0000-0000-0000-000000000002'),
  ('cc000001-0000-0000-0000-000000000010', 'bb000001-0000-0000-0000-000000000001'),
  ('cc000001-0000-0000-0000-000000000010', 'bb000001-0000-0000-0000-000000000008'),
  ('cc000001-0000-0000-0000-000000000011', 'bb000001-0000-0000-0000-000000000003'),
  ('cc000001-0000-0000-0000-000000000012', 'bb000001-0000-0000-0000-000000000003'),
  ('cc000001-0000-0000-0000-000000000012', 'bb000001-0000-0000-0000-000000000007')
ON CONFLICT DO NOTHING;

-- ─── Special Days (today is a x2 day for testing) ─────────────────────
INSERT INTO special_days (id, date, multiplier) VALUES
  ('ee000001-0000-0000-0000-000000000001', CURRENT_DATE, 2)
ON CONFLICT (date) DO NOTHING;

-- ─── Secret Boxes ─────────────────────────────────────────────────────
INSERT INTO secret_boxes (id, user_id, is_opened, reward_content, opened_at) VALUES
  ('ff000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', true,  'Voucher Grab 50K',     now() - interval '1 hour'),
  ('ff000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', false, 'Voucher Coffee 30K',   NULL),
  ('ff000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', true,  'Sticker Set Sun*',     now() - interval '2 days'),
  ('ff000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', true,  'Voucher Shopee 100K',  now() - interval '3 hours'),
  ('ff000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000003', true,  'Áo Sun* Limited',      now() - interval '5 hours'),
  ('ff000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000004', true,  'Voucher Tiki 200K',    now() - interval '8 hours'),
  ('ff000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000005', true,  'Bình nước Sun*',       now() - interval '1 day'),
  ('ff000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000006', true,  'Voucher Coffee 50K',   now() - interval '1 day 4 hours'),
  ('ff000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000007', true,  'Tai nghe Bluetooth',   now() - interval '2 days'),
  ('ff000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000008', true,  'Voucher Grab 100K',    now() - interval '2 days 6 hours'),
  ('ff000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000009', true,  'Sổ tay Sun* Premium',  now() - interval '3 days'),
  ('ff000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000010', true,  'Voucher Lazada 150K',  now() - interval '3 days 2 hours'),
  ('ff000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000002', false, 'Mystery Gift',         NULL),
  ('ff000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000004', false, 'Mystery Gift',         NULL)
ON CONFLICT (id) DO NOTHING;

-- ─── Kudos Hearts ─────────────────────────────────────────────────────
INSERT INTO kudos_hearts (id, user_id, kudos_id) VALUES
  ('ab000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000003', 'cc000001-0000-0000-0000-000000000001'),
  ('ab000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 'cc000001-0000-0000-0000-000000000001'),
  ('ab000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000005', 'cc000001-0000-0000-0000-000000000001'),
  ('ab000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000006', 'cc000001-0000-0000-0000-000000000001'),
  ('ab000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'cc000001-0000-0000-0000-000000000002'),
  ('ab000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000002', 'cc000001-0000-0000-0000-000000000002'),
  ('ab000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000005', 'cc000001-0000-0000-0000-000000000002'),
  ('ab000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000001', 'cc000001-0000-0000-0000-000000000003'),
  ('ab000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000004', 'cc000001-0000-0000-0000-000000000003'),
  ('ab000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000001', 'cc000001-0000-0000-0000-000000000004'),
  ('ab000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000002', 'cc000001-0000-0000-0000-000000000004'),
  ('ab000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000004', 'cc000001-0000-0000-0000-000000000005'),
  ('ab000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000001', 'cc000001-0000-0000-0000-000000000006')
ON CONFLICT (id) DO NOTHING;
