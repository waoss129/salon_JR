SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict AvkeHecO0NnuJ1is2qc89sMnTKKyN4CGOGaqCXf7aIzEsAas1Yj05FKvyOwbXqZ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6



--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'f5d7fb20-59cb-4827-a6df-3d96b6774ec7', '{"action":"user_signedup","actor_id":"57759410-f88d-4ed0-8153-27bd2c54257d","actor_username":"anh123@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-02 12:22:08.159744+00', ''),
	('00000000-0000-0000-0000-000000000000', '89c0f9d5-36b6-43cc-a0b0-9f6bbed94301', '{"action":"login","actor_id":"57759410-f88d-4ed0-8153-27bd2c54257d","actor_username":"anh123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-02 12:22:08.24558+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e990451-6682-4c32-b6ed-e8912195c80e', '{"action":"logout","actor_id":"57759410-f88d-4ed0-8153-27bd2c54257d","actor_username":"anh123@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-02 12:31:44.024416+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b9b4111-a251-42ae-872f-0f55917416e8', '{"action":"user_signedup","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-02 12:33:08.199334+00', ''),
	('00000000-0000-0000-0000-000000000000', '34e2245c-8867-43f4-8fab-f8bdf99c9355', '{"action":"login","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-02 12:33:08.333186+00', ''),
	('00000000-0000-0000-0000-000000000000', '38a3f20a-9a4d-413b-8046-d718c978bd0b', '{"action":"logout","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-02 12:38:07.427719+00', ''),
	('00000000-0000-0000-0000-000000000000', '55eda633-a39b-4faa-a2cf-1ef9aaf67cc2', '{"action":"login","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-02 12:38:21.791706+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c20b4430-6b5f-4518-9cc2-5c05d061d620', '{"action":"logout","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-02 12:38:43.457993+00', ''),
	('00000000-0000-0000-0000-000000000000', '748aa624-f6b8-4b86-acb7-e1dd879a6081', '{"action":"user_signedup","actor_id":"ea6cda8d-a2a1-4099-b5a3-7c8836efd104","actor_username":"kim@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-02 12:38:59.626226+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab24d305-ba76-4c4c-86ed-f8c6be9ad9af', '{"action":"login","actor_id":"ea6cda8d-a2a1-4099-b5a3-7c8836efd104","actor_username":"kim@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-02 12:38:59.786283+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acebce46-1a71-4fb7-91a5-8a0c037ffb6e', '{"action":"logout","actor_id":"ea6cda8d-a2a1-4099-b5a3-7c8836efd104","actor_username":"kim@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-02 12:50:11.287263+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dcf681e4-7212-48ca-ad27-d2dbbcce9146', '{"action":"login","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-02 12:50:29.088533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adf26740-9eee-4e4b-b70f-cb56fa87d297', '{"action":"user_modified","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-02 12:55:01.214596+00', ''),
	('00000000-0000-0000-0000-000000000000', '56ec9458-734a-41c0-be03-51af4cd16ba6', '{"action":"user_modified","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-02 12:55:10.955313+00', ''),
	('00000000-0000-0000-0000-000000000000', '34bb38c4-33d4-4bac-95d7-87ff5c941056', '{"action":"user_modified","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-02 12:55:28.237347+00', ''),
	('00000000-0000-0000-0000-000000000000', '405d61fe-5d15-491b-80ad-ef3d21a53393', '{"action":"user_modified","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-02 12:55:45.341129+00', ''),
	('00000000-0000-0000-0000-000000000000', '907cd5c5-379d-47df-9784-4eae7e74368b', '{"action":"logout","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-02 12:56:51.841336+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4d89c76-4820-4717-b820-2fa8899cc132', '{"action":"login","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-02 14:15:17.574721+00', ''),
	('00000000-0000-0000-0000-000000000000', '926f567a-8ef3-4c6a-b5cb-ebbb03f4efbf', '{"action":"user_modified","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-02 14:15:32.525622+00', ''),
	('00000000-0000-0000-0000-000000000000', '74629c46-7181-4849-a015-9e6ce280dd87', '{"action":"logout","actor_id":"25120500-082b-4197-83c8-857cd2f1b350","actor_username":"kimw@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-02 14:15:52.231589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb7abf0e-de74-4d7a-bca2-4e3bb69831a9', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"dan@gmail.com","user_id":"21ab18f4-b9bc-4b69-9253-fdb83a905302","user_phone":""}}', '2026-07-03 19:13:45.548677+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f001b513-5685-43d7-a008-edd381eb18af', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"fun@gmail.com","user_id":"9d5357b5-85ae-4e48-965b-0eec0e4ad8b5","user_phone":""}}', '2026-07-03 19:25:22.385115+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e21f3185-4c17-4322-9f7d-52e6390aedf3', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"yibo@gmail.com","user_id":"40c7eaad-fc72-48df-b608-39039f02c04d","user_phone":""}}', '2026-07-03 19:31:20.480685+00', ''),
	('00000000-0000-0000-0000-000000000000', '24d25951-ea6a-43be-a820-0b1087a91fde', '{"action":"user_signedup","actor_id":"b6d70ae4-b30d-4744-b2ec-1a502d46f41a","actor_username":"jang@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 07:55:49.470064+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ae4e727-5768-4981-a036-0d977957ca66', '{"action":"login","actor_id":"b6d70ae4-b30d-4744-b2ec-1a502d46f41a","actor_username":"jang@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 07:55:49.522788+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9147c19-52fa-4307-9286-a3124c31de5e', '{"action":"user_modified","actor_id":"b6d70ae4-b30d-4744-b2ec-1a502d46f41a","actor_username":"jang@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 07:56:03.266731+00', ''),
	('00000000-0000-0000-0000-000000000000', '62646ad8-49cf-4e7c-b5bd-fd207b8ae63c', '{"action":"logout","actor_id":"b6d70ae4-b30d-4744-b2ec-1a502d46f41a","actor_username":"jang@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 08:02:40.75578+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be5d4392-9295-4356-a0a2-f22a74c3dfbe', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jang@gmail.com","user_id":"b6d70ae4-b30d-4744-b2ec-1a502d46f41a","user_phone":""}}', '2026-07-04 08:03:03.045757+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b4b0796-95db-4949-bbd4-e7968d12bd3f', '{"action":"user_signedup","actor_id":"c83391bc-74fc-4dbb-8846-3bb5cc6a9a69","actor_username":"liz@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 08:21:25.076005+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e66cac47-868b-4799-8af4-1fbac99e7863', '{"action":"login","actor_id":"c83391bc-74fc-4dbb-8846-3bb5cc6a9a69","actor_username":"liz@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 08:21:25.135651+00', ''),
	('00000000-0000-0000-0000-000000000000', '8dfac718-93f8-4290-a999-50623f3cee5b', '{"action":"user_signedup","actor_id":"c86f2660-4985-4949-95eb-6a46098fc22e","actor_username":"liz@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 08:33:38.631311+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f246fc50-cdb0-4f4c-a95f-158fa7c20cbd', '{"action":"login","actor_id":"c86f2660-4985-4949-95eb-6a46098fc22e","actor_username":"liz@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 08:33:38.690158+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ac9629a-14d4-4d0f-b8ce-176fbec493bc', '{"action":"user_modified","actor_id":"c86f2660-4985-4949-95eb-6a46098fc22e","actor_username":"liz@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 08:34:22.212761+00', ''),
	('00000000-0000-0000-0000-000000000000', '530336ea-7e23-42da-9093-823de2dfe313', '{"action":"logout","actor_id":"c86f2660-4985-4949-95eb-6a46098fc22e","actor_username":"liz@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 09:16:36.675257+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9dc6d51-72fe-4134-a961-da31f8db8279', '{"action":"user_signedup","actor_id":"a00067e6-1805-4702-8fdf-c3a609079097","actor_username":"han@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 09:16:53.217697+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1826399-1333-4681-82f5-7103b546465f', '{"action":"login","actor_id":"a00067e6-1805-4702-8fdf-c3a609079097","actor_username":"han@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 09:16:53.340731+00', ''),
	('00000000-0000-0000-0000-000000000000', '168408ad-941a-41e7-8f8e-374174b10cee', '{"action":"user_modified","actor_id":"a00067e6-1805-4702-8fdf-c3a609079097","actor_username":"han@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 09:17:05.065071+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9cea62d-7e53-4fca-9d0c-1e30fdb2bfed', '{"action":"logout","actor_id":"a00067e6-1805-4702-8fdf-c3a609079097","actor_username":"han@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 09:43:30.775993+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b941e31-13cd-402c-8ad0-663dca07fa9f', '{"action":"user_signedup","actor_id":"ce0b06be-3d66-4822-aa83-efa75c8b5ced","actor_username":"anh@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 09:46:46.573582+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe74930a-9e03-4e68-a34a-2eb10f365d6c', '{"action":"login","actor_id":"ce0b06be-3d66-4822-aa83-efa75c8b5ced","actor_username":"anh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 09:46:46.622162+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cfcfe67-b17a-4680-a8ea-890d8f4e3719', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"anh@gmail.com","user_id":"ce0b06be-3d66-4822-aa83-efa75c8b5ced","user_phone":""}}', '2026-07-04 09:52:49.795308+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3a5816e-7cb8-462e-9aae-dc35d09679b6', '{"action":"user_signedup","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 09:58:22.507063+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf0dca11-81af-4a1b-acbc-a50b0689d905', '{"action":"login","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 09:58:22.559934+00', ''),
	('00000000-0000-0000-0000-000000000000', '854b18a8-cd6b-4d97-a3d2-62a5852b45ed', '{"action":"user_modified","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 10:00:06.662756+00', ''),
	('00000000-0000-0000-0000-000000000000', '6451047e-875e-4fbc-b5d8-ca7b5547bf05', '{"action":"logout","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 10:05:20.708949+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a325f873-0746-4b20-ab95-80676f15227e', '{"action":"login","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 10:05:36.975528+00', ''),
	('00000000-0000-0000-0000-000000000000', '43628f52-e6a0-44c1-b178-9f81b888f57b', '{"action":"user_modified","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 10:05:50.578967+00', ''),
	('00000000-0000-0000-0000-000000000000', '686ab6bf-543b-4f91-b8fd-15aa8a922fc9', '{"action":"logout","actor_id":"0a8cfe56-3563-46e2-8d9d-a8eceb08bce9","actor_username":"hun@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 10:06:07.624893+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0fa935d-a433-4870-9ee1-d959495598fe', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"seo@gmail.com","user_id":"b7bbfbae-9257-468e-8d01-f5ecd3cdd6cd","user_phone":""}}', '2026-07-04 10:14:12.207589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb54dc1f-cab2-4bdf-a5a1-13e29faf375d', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"lanshen@gmail.com","user_id":"24c9b2a0-9b9b-4c00-93ab-a223013102fa","user_phone":""}}', '2026-07-04 10:16:25.760758+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a96e70f-d0d2-487b-9c81-45fa2680fc3a', '{"action":"user_signedup","actor_id":"c210e22b-0274-4b47-9adf-fbb8fbe61cf2","actor_username":"chao@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 10:17:38.44922+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f3c5e08-6141-4db3-9aad-a64ff1d66bf3', '{"action":"login","actor_id":"c210e22b-0274-4b47-9adf-fbb8fbe61cf2","actor_username":"chao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 10:17:38.499617+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cdf5159-8a55-45d5-a9c9-819bdb20fe1d', '{"action":"user_modified","actor_id":"c210e22b-0274-4b47-9adf-fbb8fbe61cf2","actor_username":"chao@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 10:18:20.491788+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f18ce8a-9103-408c-9e45-6e0f75cb0e77', '{"action":"logout","actor_id":"c210e22b-0274-4b47-9adf-fbb8fbe61cf2","actor_username":"chao@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 10:18:29.211176+00', ''),
	('00000000-0000-0000-0000-000000000000', '3bc11b01-75ea-46bd-83f0-86619040af91', '{"action":"user_signedup","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-04 10:23:22.41906+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c82765ca-a376-4a90-8a50-0b6167a19794', '{"action":"login","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-04 10:23:22.446838+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5e4663d-4f58-4bb4-8338-fe196db8952c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chao@gmail.com","user_id":"c210e22b-0274-4b47-9adf-fbb8fbe61cf2","user_phone":""}}', '2026-07-04 10:23:40.062883+00', ''),
	('00000000-0000-0000-0000-000000000000', '5593d17e-f33c-4bec-940f-c89248422650', '{"action":"user_modified","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-04 10:24:11.871588+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad0b9686-7f9a-4448-9d66-5c29f34833a2', '{"action":"logout","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 10:24:18.548593+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7d25700-95fb-4def-9aed-fc68e680cbe1', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"zheyin@gmail.com","user_id":"35fff978-cfe2-45e3-a2c9-6030e1ef2136","user_phone":""}}', '2026-07-05 07:22:37.911337+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bae8f5b9-8144-4e99-8ad3-71713b4d4c0f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"young@gmail.com","user_id":"8dcd655e-cdc5-487f-8f7f-b3ac4524cfa7","user_phone":""}}', '2026-07-05 07:23:46.915738+00', ''),
	('00000000-0000-0000-0000-000000000000', '353be248-d431-486f-a34e-ce7b5dfc7f74', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"liz@gmail.com","user_id":"ba85d008-3661-4f9c-8bcc-e017dd0e2d8a","user_phone":""}}', '2026-07-05 07:24:08.757564+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f420597-bd70-4fa5-a90d-2b90f2aa3606', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"banghacam@gmail.com","user_id":"c8cb3719-2716-4c12-8f28-92637a428246","user_phone":""}}', '2026-07-05 07:24:44.530662+00', ''),
	('00000000-0000-0000-0000-000000000000', '68cd9ae4-0532-41a1-8bb1-f595cc914c7d', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"lam@gmail.com","user_id":"c0c845ab-fc25-4b8a-9514-5a209ec48753","user_phone":""}}', '2026-07-05 07:25:03.982242+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c708aa05-4652-4e18-a0b6-aaf198d970ff', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"zhanghun@gmail.com","user_id":"f1e4ce8a-33c6-49c5-8095-886957fb9940","user_phone":""}}', '2026-07-05 07:36:01.314219+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ea7c625-42cf-42a7-acde-53145609403b', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ngan123@gmail.com","user_id":"84ab2e5e-f010-42e1-b372-b258f78e365f","user_phone":""}}', '2026-07-05 09:42:00.158272+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc52b06b-05df-450a-8041-8ec3e298947f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"liz@gmail.com","user_id":"ba85d008-3661-4f9c-8bcc-e017dd0e2d8a","user_phone":""}}', '2026-07-05 10:37:58.429695+00', ''),
	('00000000-0000-0000-0000-000000000000', '27e7456d-f10b-40f5-bfe7-9d3c17c9b8b3', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"young@gmail.com","user_id":"8dcd655e-cdc5-487f-8f7f-b3ac4524cfa7","user_phone":""}}', '2026-07-05 10:38:22.280691+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c019667-5db3-4ef6-9226-098194c2bfda', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"young@gmail.com","user_id":"fc03395a-7247-4222-9584-0310cc5d4a8e","user_phone":""}}', '2026-07-05 10:39:14.384917+00', ''),
	('00000000-0000-0000-0000-000000000000', '4841d6bd-53e4-43d2-b104-fcde2eb378b0', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"hoangbaongan951@gmail.com","user_id":"54dcbb31-7407-40f7-93d0-696f076a5b11","user_phone":""}}', '2026-07-05 11:21:43.692028+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b8dd20e-0afa-476e-b329-7839e900738f', '{"action":"login","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-06 06:10:09.970232+00', ''),
	('00000000-0000-0000-0000-000000000000', '4cb31c8b-2837-4030-af4e-2375daeb5c83', '{"action":"user_modified","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-06 06:10:23.38004+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c23229f-a61d-4c4e-b923-6148b2656193', '{"action":"logout","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-06 06:11:15.262627+00', ''),
	('00000000-0000-0000-0000-000000000000', '08eada53-eea0-4dc9-8c2f-efa85f62fb63', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"zhanghun@gmail.com","user_id":"f1e4ce8a-33c6-49c5-8095-886957fb9940","user_phone":""}}', '2026-07-06 07:25:05.408898+00', ''),
	('00000000-0000-0000-0000-000000000000', '161c3cf0-ef62-4b43-9ea2-2e536563a831', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"soo@gmail.com","user_id":"9c128e03-ae47-4e5b-a1a8-347b9550cc67","user_phone":""}}', '2026-07-06 07:29:44.587162+00', ''),
	('00000000-0000-0000-0000-000000000000', '173ef47f-2c26-4a31-ae33-60958eeedbbb', '{"action":"user_repeated_signup","actor_id":"9c128e03-ae47-4e5b-a1a8-347b9550cc67","actor_name":"Kim Trí Tú","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2026-07-06 08:35:53.19356+00', ''),
	('00000000-0000-0000-0000-000000000000', '920d5343-a412-43a6-a60a-4cd30b013820', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"soo@gmail.com","user_id":"9c128e03-ae47-4e5b-a1a8-347b9550cc67","user_phone":""}}', '2026-07-06 08:39:33.512573+00', ''),
	('00000000-0000-0000-0000-000000000000', '1193dfbd-dcdc-434b-bf93-69eee69917c4', '{"action":"user_signedup","actor_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-06 08:40:04.708824+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebd0ce5f-342e-4ea0-a1fc-bbc3d927006c', '{"action":"login","actor_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-06 08:40:04.76382+00', ''),
	('00000000-0000-0000-0000-000000000000', '31a9f9f5-94b3-4f18-86d5-e82a7de60680', '{"action":"user_modified","actor_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-06 08:41:00.493351+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e14c2dba-22c4-4c51-9d68-86dccac5786f', '{"action":"logout","actor_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-06 08:41:39.345127+00', ''),
	('00000000-0000-0000-0000-000000000000', '060f8df2-7e77-4b81-b105-6f68b8002392', '{"action":"login","actor_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-06 08:41:55.163157+00', ''),
	('00000000-0000-0000-0000-000000000000', '248a66ee-abc6-44ac-9c88-a1688475df35', '{"action":"user_modified","actor_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","actor_username":"soo@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-06 08:59:05.242689+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da77f4ea-5ce4-4121-9724-a880d4728764', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"soo@gmail.com","user_id":"a50f9931-caf7-4b81-b43c-b6f8d3d56c14","user_phone":""}}', '2026-07-12 06:24:43.64905+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9be6f97-e6fc-4dab-b8a2-baea45dcf8b8', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ngan123@gmail.com","user_id":"84ab2e5e-f010-42e1-b372-b258f78e365f","user_phone":""}}', '2026-07-12 06:24:43.649047+00', ''),
	('00000000-0000-0000-0000-000000000000', '7faf506e-2a19-4801-9b3c-8e1ea2a3e53b', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"banghacam@gmail.com","user_id":"c8cb3719-2716-4c12-8f28-92637a428246","user_phone":""}}', '2026-07-12 06:24:43.649132+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da38cb7f-6b46-42c3-9367-2d9848665909', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lam@gmail.com","user_id":"c0c845ab-fc25-4b8a-9514-5a209ec48753","user_phone":""}}', '2026-07-12 06:24:43.649048+00', ''),
	('00000000-0000-0000-0000-000000000000', '83e2d88b-1163-473d-acea-e5c68ced51c9', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"lanshen@gmail.com","user_id":"24c9b2a0-9b9b-4c00-93ab-a223013102fa","user_phone":""}}', '2026-07-12 06:24:43.649049+00', ''),
	('00000000-0000-0000-0000-000000000000', '21f39d97-bfba-47d1-a0f0-d8b5e38abfc0', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"hoangbaongan951@gmail.com","user_id":"54dcbb31-7407-40f7-93d0-696f076a5b11","user_phone":""}}', '2026-07-12 06:24:43.64922+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e64921b8-4f36-40a6-bfff-aac6e5bacab6', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"tin@gmail.com","user_id":"84c15dff-946b-496c-b649-99303efbd59e","user_phone":""}}', '2026-07-12 06:24:43.903535+00', ''),
	('00000000-0000-0000-0000-000000000000', 'efd5e609-3fbe-4d87-9172-3f308892fe30', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"young@gmail.com","user_id":"fc03395a-7247-4222-9584-0310cc5d4a8e","user_phone":""}}', '2026-07-12 06:24:43.907651+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ab3d99d-0d31-49bb-9e91-37aa0cd73a68', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"zheyin@gmail.com","user_id":"35fff978-cfe2-45e3-a2c9-6030e1ef2136","user_phone":""}}', '2026-07-12 06:24:43.90948+00', ''),
	('00000000-0000-0000-0000-000000000000', '53829bc1-886a-4cef-9fca-48802f7babdc', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:45:13.95238+00', ''),
	('00000000-0000-0000-0000-000000000000', '78bc68f4-ae86-4b50-8586-398f868d7717', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:45:17.799299+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb7d4fb0-7ef0-400b-91d5-573d67fcbda6', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:45:25.446379+00', ''),
	('00000000-0000-0000-0000-000000000000', '032bf822-3d86-4f72-be8a-7390fe96ffc5', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:45:33.254351+00', ''),
	('00000000-0000-0000-0000-000000000000', '6aa44001-0ab4-4230-818c-251f72590743', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:46:55.4927+00', ''),
	('00000000-0000-0000-0000-000000000000', '21802e84-c291-4cf9-8168-4607af2beeac', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:46:59.458049+00', ''),
	('00000000-0000-0000-0000-000000000000', '3186199d-54c7-49f7-9faf-7080900d335f', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:47:07.961746+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f650d3a-a77c-4a8a-937d-f79244155279', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:47:22.851448+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f33aabcd-6a1a-488e-9b78-32df7b45571f', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:47:31.401844+00', ''),
	('00000000-0000-0000-0000-000000000000', '97c37c90-4767-475d-a1bd-a980a7932154', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:53:54.622766+00', ''),
	('00000000-0000-0000-0000-000000000000', '72a66265-89dc-418a-ab6d-f3ddc956ba0c', '{"action":"login","actor_id":"bab2d2c1-852d-4956-a777-9942a2201a80","actor_username":"foryoung@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:54:04.828239+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea270492-21ee-4c8d-a89d-9a308df718d2', '{"action":"user_updated_password","actor_id":"bab2d2c1-852d-4956-a777-9942a2201a80","actor_username":"foryoung@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 09:56:03.958564+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5a405ba-83e2-48d9-a8eb-2daefbe6268a', '{"action":"user_modified","actor_id":"bab2d2c1-852d-4956-a777-9942a2201a80","actor_username":"foryoung@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 09:56:03.961001+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e53f01a-4b54-4f20-8998-84db45e7264f', '{"action":"logout","actor_id":"bab2d2c1-852d-4956-a777-9942a2201a80","actor_username":"foryoung@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:56:07.056711+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c58e86d-6001-42d4-b46e-e309040f0c99', '{"action":"login","actor_id":"bab2d2c1-852d-4956-a777-9942a2201a80","actor_username":"foryoung@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:56:15.422661+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ac8fa3f-3117-4d33-8e35-0ecd051d9556', '{"action":"logout","actor_id":"bab2d2c1-852d-4956-a777-9942a2201a80","actor_username":"foryoung@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 09:56:19.203717+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8e73c6c-6103-4e33-8300-c4ab36752bf5', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 09:56:28.015553+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d587d50-8187-451f-8b1f-9c976a13f892', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 10:07:04.507632+00', ''),
	('00000000-0000-0000-0000-000000000000', '661e53ec-1b53-4adf-b030-183642b220a4', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 10:31:39.676731+00', ''),
	('00000000-0000-0000-0000-000000000000', '8652046b-a9c8-4748-9ba1-2ea704711249', '{"action":"user_signedup","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-12 10:32:25.588938+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4157707-a5cc-4530-bf28-c42d294f30ea', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 10:32:25.610454+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7f3f850-4fe8-4027-9286-d2f214ec8e5d', '{"action":"logout","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 10:33:02.855383+00', ''),
	('00000000-0000-0000-0000-000000000000', '9712d653-1714-455d-bcf5-06e34f4485d9', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 10:45:39.306129+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4471ef1-395e-488b-95bb-baa894a6ba95', '{"action":"user_recovery_requested","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 10:55:05.734364+00', ''),
	('00000000-0000-0000-0000-000000000000', '25a8b766-35aa-4993-a1d1-0145066790f9', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 10:55:17.684389+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8523079-1d47-4396-9cc1-5ecbd5eaf135', '{"action":"user_modified","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:26:10.017547+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b30bb4e-63a1-4715-a1e2-82acadb806b5', '{"action":"user_recovery_requested","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 11:02:14.468294+00', ''),
	('00000000-0000-0000-0000-000000000000', '431fd979-3815-471e-9ade-bbc4e343b35b', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 11:02:23.061999+00', ''),
	('00000000-0000-0000-0000-000000000000', '122a679e-91a5-4b1e-9f8f-641841fe1ee3', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-12 11:02:32.157485+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1f83199-f4f9-4a1f-a6e7-73a04c817cef', '{"action":"user_updated_password","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 11:03:08.788295+00', ''),
	('00000000-0000-0000-0000-000000000000', '96a6c65e-1f23-4476-9c5b-85122f8c819c', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 11:03:08.789894+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae8623fa-ea0f-47bd-b80d-69dbe43226d0', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 11:03:14.933469+00', ''),
	('00000000-0000-0000-0000-000000000000', '1139b4d4-fb31-4eb5-987c-12fd3613841f', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 11:03:22.461025+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9a2b6b5-31ba-4af4-b3e8-d55228a72188', '{"action":"user_recovery_requested","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 11:04:52.172497+00', ''),
	('00000000-0000-0000-0000-000000000000', '445626bd-182e-4912-8b0e-7a0da52a75c2', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 11:05:10.646048+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2147029-418a-4634-8187-d5daf3e8b051', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-12 11:05:11.362354+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e63f4f4-8bd0-4044-87fd-cca39fa6ccc6', '{"action":"user_updated_password","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 11:13:18.077249+00', ''),
	('00000000-0000-0000-0000-000000000000', '461062ae-dc70-4ea2-9688-9d9936f96146', '{"action":"user_modified","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-12 11:13:18.084682+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b299cd33-f450-49ef-9af4-43538c7b757b', '{"action":"logout","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 11:21:23.809703+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7dd5fcb-c24c-40a5-a9fc-05a3c81fc0d0', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 11:32:25.973322+00', ''),
	('00000000-0000-0000-0000-000000000000', '05d3f5de-a003-43fc-a5c0-89609a7c8e42', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 11:32:33.837025+00', ''),
	('00000000-0000-0000-0000-000000000000', '00ca6f9d-9534-49e9-8840-3878c39cd66a', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 11:48:24.658034+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1649c34-4df8-4eb9-a12c-7e28b4cfe8c4', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 11:48:32.829586+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9aff3f5-9800-4c56-975f-fdbda1188bc4', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 12:50:34.908801+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2133885-f4f1-43f2-a1b4-bceef7ca183c', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 12:50:34.922234+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ffde34f-b809-4001-a780-d73067e15247', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 12:50:47.435788+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee059d1d-e304-4da1-84aa-baa613049b54', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 12:50:47.85794+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4af9f35-532d-40f1-80e0-24085c670d5e', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 13:06:23.823279+00', ''),
	('00000000-0000-0000-0000-000000000000', '39c7ac6a-7665-48ab-b3e1-d7c69a7d838d', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 13:48:54.959889+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc756ef5-8263-417c-ad4a-bcdebd981819', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 13:48:54.972992+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f35c18fe-de6b-4403-88c8-f3860dc80873', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 14:30:56.015257+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c40827b2-d010-4d86-bfd8-3c9189f5ab4d', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-12 14:30:56.034205+00', ''),
	('00000000-0000-0000-0000-000000000000', '5043dfe5-cdc3-4dba-8c61-0fbed81e4185', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 14:37:37.550332+00', ''),
	('00000000-0000-0000-0000-000000000000', '9835d5dd-353e-4026-b4cd-ca548bcca846', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 14:37:45.758672+00', ''),
	('00000000-0000-0000-0000-000000000000', '8dadda7d-2562-4a92-969d-8f6cbba80449', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-12 14:40:37.851024+00', ''),
	('00000000-0000-0000-0000-000000000000', '24f2500d-ee55-4a28-a366-7b2002fede40', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-12 14:41:19.877956+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc4c00a9-a351-4a13-b9ed-77b9d7014286', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"xuying@gmail.com","user_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","user_phone":""}}', '2026-07-12 14:42:05.802242+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff697bd5-aa10-4c4e-a20a-29c469c19b99', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 00:39:27.406129+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af3f629e-09c4-40ce-bb10-416e3a6643b8', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 00:39:27.413143+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a7e8a6ea-0aad-4d7a-87f4-8f34c9b58336', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 00:42:35.262169+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8070965-c86c-4ede-8eed-3f4c543de0b1', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 00:42:35.263597+00', ''),
	('00000000-0000-0000-0000-000000000000', '357262d3-b90c-42bc-b02a-8be839e3db47', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 01:38:55.485277+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd00f5c41-b086-4e5f-9056-3e34d6038eef', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 01:38:55.612933+00', ''),
	('00000000-0000-0000-0000-000000000000', '35e356cb-631a-4ec9-87f5-b3f08b660f1d', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 01:39:15.840542+00', ''),
	('00000000-0000-0000-0000-000000000000', '91f43eb3-bd8a-49e0-86d5-98aac755d75a', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 01:45:34.664929+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb194709-d796-4497-9ef3-bb157be9fcb4', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 01:45:34.672721+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b0e6896-f2dd-49e8-a9c7-df61160c2d27', '{"action":"user_modified","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 01:59:44.204921+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ed1d312-3393-4973-8aee-9aaaa4e70d82', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 02:37:28.998139+00', ''),
	('00000000-0000-0000-0000-000000000000', '878e4698-191a-43fd-acd3-49a3dcc70db6', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 02:37:29.008621+00', ''),
	('00000000-0000-0000-0000-000000000000', '0617408a-6471-4305-b777-e456c03935bb', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 02:48:25.647396+00', ''),
	('00000000-0000-0000-0000-000000000000', '68163ace-d684-45e1-a570-7f5be01f87c4', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 02:48:25.649284+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2bdaba9-cab2-43fa-8fd6-b9ebc352c5c9', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 03:44:58.401575+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac467827-52c7-4466-8ce8-5b8bcc657330', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 03:44:58.413056+00', ''),
	('00000000-0000-0000-0000-000000000000', '341bbae9-ab5d-400d-a29c-c87fe9af11d3', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 04:07:25.819812+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2178f71-6344-4b80-be00-80324c9c39d6', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 04:07:25.826674+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0b2dc6c-c3cb-4dbd-8bfa-131e2fc4283d', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 04:57:20.883778+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a04f9a0f-658f-43d5-9438-d0754822e1ef', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 04:57:20.894553+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0e8c455-e14d-47cb-8d9a-b3e0e81e0146', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 05:12:30.581897+00', ''),
	('00000000-0000-0000-0000-000000000000', '5347d910-170c-44cd-9c91-7a576d9725fb', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 05:12:30.607301+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd23ee0fe-6c0a-496a-92bd-b938982cb856', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:24:51.298166+00', ''),
	('00000000-0000-0000-0000-000000000000', '4719aaf4-1d87-471d-80aa-14f2345a1b23', '{"action":"user_recovery_requested","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:25:40.991562+00', ''),
	('00000000-0000-0000-0000-000000000000', '0790a4d9-e842-44b8-93dc-7359fa8c6a99', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:25:53.765616+00', ''),
	('00000000-0000-0000-0000-000000000000', '10cdf741-60d2-44ea-aac1-9df767e91c47', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-13 05:25:55.70639+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8b994c1-ffca-4544-8920-2b32632cb1ca', '{"action":"user_updated_password","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:26:57.243014+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6b31fbd-b65f-4beb-ba78-89d8c2e1c7c4', '{"action":"user_modified","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:26:57.244404+00', ''),
	('00000000-0000-0000-0000-000000000000', '02e57b20-879e-41a5-a363-c55949bd80a9', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:29:26.685695+00', ''),
	('00000000-0000-0000-0000-000000000000', '5040bc09-bae2-4e0b-a8e7-dd6335bb25ed', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 05:31:50.976856+00', ''),
	('00000000-0000-0000-0000-000000000000', '752e76d0-4337-4c0d-a153-defd7292ec05', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:37:28.937064+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae702002-6981-4ccc-a123-c569d241614b', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 05:37:36.938577+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f1f9d9a7-5610-4b7f-b469-71391578b5f1', '{"action":"logout","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:49:02.044622+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1c6e9b4-e84d-44dd-8e56-4abd2970d37f', '{"action":"user_recovery_requested","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:49:44.224489+00', ''),
	('00000000-0000-0000-0000-000000000000', '7278626d-dd1b-4874-b786-e20c9edf4496', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:49:53.001838+00', ''),
	('00000000-0000-0000-0000-000000000000', '35b3bdc8-8c68-46bd-9f81-aeb886f7f250', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-13 05:49:56.068216+00', ''),
	('00000000-0000-0000-0000-000000000000', '1db78ae4-be6c-4c32-a21e-1f649aa1c93f', '{"action":"user_updated_password","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:51:07.56504+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da5110ed-89b6-4b91-8b85-21d37b8949ad', '{"action":"user_modified","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:51:07.566432+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ae2be5df-4e60-4cdc-8e9b-afaa9fdfa80b', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 05:51:29.620747+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bc3e71a-6855-48a4-923e-5979172b3b99', '{"action":"user_modified","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:51:45.500607+00', ''),
	('00000000-0000-0000-0000-000000000000', '55a2509d-6e51-41a6-a57e-a7b88b752e10', '{"action":"user_updated_password","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:52:01.634399+00', ''),
	('00000000-0000-0000-0000-000000000000', '22a80452-c9f7-4dc7-9f78-0085c79792c3', '{"action":"user_modified","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:52:01.635832+00', ''),
	('00000000-0000-0000-0000-000000000000', '332c8eb8-4ad6-4988-bdeb-4bb1db348438', '{"action":"logout","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:52:05.117946+00', ''),
	('00000000-0000-0000-0000-000000000000', '63ca4769-946c-4442-a490-1b7461df3753', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 05:52:27.511759+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1b4635f-2068-40ad-a64b-8ff974b90de8', '{"action":"user_recovery_requested","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:56:26.667858+00', ''),
	('00000000-0000-0000-0000-000000000000', '232febc5-4696-4ad5-939c-4802c6cdff28', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:57:03.778107+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3174180-c334-4be1-a556-ccb9f3e29978', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-13 05:57:04.400928+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a24e8fab-e4d6-472e-aed3-6a8bd80aa3fb', '{"action":"user_updated_password","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:57:41.362963+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aaa96f6f-f72c-415f-a951-7d79a7480269', '{"action":"user_modified","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 05:57:41.364454+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de6150a4-2c7b-4ac8-ad64-c23f208fe40d', '{"action":"logout","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 05:57:51.140643+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a64fd8f-4a4b-45e8-8ee1-5cd76c8e9212', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 05:58:04.302789+00', ''),
	('00000000-0000-0000-0000-000000000000', '8571af6e-0aa9-4d2d-ad39-c03424567733', '{"action":"user_signedup","actor_id":"f545dcc9-d10f-4ae6-b8da-0cebac176699","actor_username":"kian@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-13 06:01:53.242519+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2f033b8-f37c-4419-af3a-16d0fb127b5f', '{"action":"login","actor_id":"f545dcc9-d10f-4ae6-b8da-0cebac176699","actor_username":"kian@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:01:53.271634+00', ''),
	('00000000-0000-0000-0000-000000000000', '79d4a74d-da2c-46fb-a45f-9b977e598012', '{"action":"user_modified","actor_id":"f545dcc9-d10f-4ae6-b8da-0cebac176699","actor_username":"kian@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:02:13.991227+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0fff6aa-fc06-427b-8a87-f883bbbacccb', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:17:38.00846+00', ''),
	('00000000-0000-0000-0000-000000000000', '78226175-30a1-41b2-97c1-3e9d3ca7b10a', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:18:15.713121+00', ''),
	('00000000-0000-0000-0000-000000000000', '49cb2dfd-655a-43fd-8c8d-30e760f72002', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:19:05.6682+00', ''),
	('00000000-0000-0000-0000-000000000000', '94fe5ccd-992b-43b7-9655-d1cef7921b17', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:20:03.271253+00', ''),
	('00000000-0000-0000-0000-000000000000', '911e807c-4544-4e6a-87f3-d26b2566f4c7', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:23:27.784132+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e576b48a-f6cd-4cf1-bdfc-a495e6eb2d1e', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:23:46.500844+00', ''),
	('00000000-0000-0000-0000-000000000000', '38b46095-a717-4a9b-999e-d0b96a9603c6', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:24:33.472677+00', ''),
	('00000000-0000-0000-0000-000000000000', '3332d77f-8b73-4028-844c-6c11cb1edff4', '{"action":"user_recovery_requested","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:25:28.035349+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b9ce2ff-e55e-4069-bb61-9647aad6e0c6', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:25:35.061477+00', ''),
	('00000000-0000-0000-0000-000000000000', '1790df5b-bd9c-4c5f-b59c-f4a760acff5f', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-13 06:25:36.747447+00', ''),
	('00000000-0000-0000-0000-000000000000', '93f0f45a-fb5c-4472-ae30-e2a55e7c87c7', '{"action":"user_updated_password","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:26:10.015994+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c4bcd26-f9d9-46f9-a994-0b8589805bc4', '{"action":"logout","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:29:03.58051+00', ''),
	('00000000-0000-0000-0000-000000000000', '60bd555d-f194-4c38-ad7f-2b8cf1d1023a', '{"action":"user_recovery_requested","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:29:14.647847+00', ''),
	('00000000-0000-0000-0000-000000000000', '72407912-a23b-442c-b6c2-2e3ea48082f8', '{"action":"login","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:29:21.198848+00', ''),
	('00000000-0000-0000-0000-000000000000', '45ce20f8-57b4-420e-bbb8-fa60775b54ea', '{"action":"login","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}', '2026-07-13 06:29:21.593276+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc79e4e4-7563-4450-9140-e8a0e68fb857', '{"action":"user_updated_password","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:29:31.892782+00', ''),
	('00000000-0000-0000-0000-000000000000', '3448d3bb-36a7-4ad9-977a-0b1de178e56b', '{"action":"user_modified","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 06:29:31.89418+00', ''),
	('00000000-0000-0000-0000-000000000000', '191c1249-c83d-4d53-8a4b-6b15b98ff957', '{"action":"token_refreshed","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 06:52:01.786332+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5bf84c1-bdb8-4efa-9ae5-f6fdc27f2675', '{"action":"token_revoked","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 06:52:01.795064+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7a1df2e-f923-4695-9c95-8c84e6a2a615', '{"action":"logout","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:52:23.146351+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee85a0ec-505b-48ae-aa10-a6795e3301aa', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:53:10.645786+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b9ee9bc-d036-4373-9fd1-138ec171d32e', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:53:16.189952+00', ''),
	('00000000-0000-0000-0000-000000000000', '34e7709e-592f-4543-ba43-865c0584cab9', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:53:34.140043+00', ''),
	('00000000-0000-0000-0000-000000000000', '25f6ebb1-49b4-4831-9592-3877507d1ecf', '{"action":"logout","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 06:53:44.132272+00', ''),
	('00000000-0000-0000-0000-000000000000', '5dc1a1a1-62e9-4acf-8955-e98fd6f214fb', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 06:53:53.84202+00', ''),
	('00000000-0000-0000-0000-000000000000', '8af29a95-6e72-4d84-acd8-96173799de1a', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 06:56:55.807786+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5678c07-04be-4ca7-bdb5-d275cc2ea472', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 06:56:55.816848+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb99d18e-4e7d-4294-9ed9-677fb1e9f80b', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 06:56:56.002899+00', ''),
	('00000000-0000-0000-0000-000000000000', '59d3fd46-d305-47d8-89bc-5e785a727c7b', '{"action":"user_modified","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 07:03:04.695283+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea5ccc70-f2a4-4727-9f5b-97e7597e9943', '{"action":"user_modified","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"xuying@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 07:03:22.384281+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f6ff473-b3e4-4940-baa2-83628baea0f6', '{"action":"logout","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 07:03:47.131112+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb4796e5-829b-4fa9-a6fc-5ddc1231adf5', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:04:41.869554+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e325bff-e605-4c3a-819d-90c8319ac260', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:05:28.081589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aace9cf7-08e8-4935-9adb-579c2af38f5e', '{"action":"user_updated_password","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 07:05:28.351833+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e5537d8-8987-4b63-98ca-279a351db455', '{"action":"user_modified","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"user"}', '2026-07-13 07:05:28.35341+00', ''),
	('00000000-0000-0000-0000-000000000000', '77f39774-8bc8-448e-bef9-32b072315f3d', '{"action":"logout","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 07:05:32.207636+00', ''),
	('00000000-0000-0000-0000-000000000000', '0575f44e-a08e-4144-a965-11c4a2a83cfa', '{"action":"login","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:05:46.003181+00', ''),
	('00000000-0000-0000-0000-000000000000', '188903b7-ba4e-466f-bed5-51b380244c58', '{"action":"logout","actor_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","actor_name":"Từ Thục Anh","actor_username":"thuanh@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 07:13:34.382402+00', ''),
	('00000000-0000-0000-0000-000000000000', '71337613-ed6c-42a4-8bb0-473f2475f30a', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:15:18.935646+00', ''),
	('00000000-0000-0000-0000-000000000000', '9356df75-5b99-4c17-a0a3-966da44b33ae', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 07:30:14.698306+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7e4af87-39c0-45fc-acdb-a81070a0c417', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:30:22.967392+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ee92455-7015-4eef-bae3-92fb726b0d53', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 07:30:34.017358+00', ''),
	('00000000-0000-0000-0000-000000000000', '5318ff82-41ca-4148-b8e9-751fb0c2577f', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:30:43.317549+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da745398-bacf-4a1d-98de-9d7cc507ae11', '{"action":"logout","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 07:30:52.293595+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a899a69-418b-4b77-bcf2-56821b11aba9', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 07:31:03.593135+00', ''),
	('00000000-0000-0000-0000-000000000000', 'efe8d8c8-b6cb-4ac3-98e2-4e159b61bdf2', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 07:57:30.636586+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb1314a4-1e80-43ce-98b8-b19008cf6153', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 07:57:30.643857+00', ''),
	('00000000-0000-0000-0000-000000000000', '413c94da-5db3-462f-bf07-b89276814a5f', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 08:04:15.799335+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3b6b665-b4c7-4c3e-8e7b-0062647fa4db', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 08:04:36.788219+00', ''),
	('00000000-0000-0000-0000-000000000000', '545b660f-6c24-4750-9e45-926915a3007c', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 08:05:42.36209+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e298632-4325-4746-a90b-9836f5f5137f', '{"action":"token_refreshed","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:02:52.851564+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b4a207c-96f8-4b56-8401-77fd2a21fa51', '{"action":"token_revoked","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:02:52.880444+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd404e41c-7e0a-4ceb-8d09-9c6ee622a7a4', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:03:02.221856+00', ''),
	('00000000-0000-0000-0000-000000000000', '3cd02171-3a01-42a7-beaa-1ca79a4d9aa2', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:03:02.31427+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e4bc8eb-c358-49c2-935e-127e0c2694dc', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:03:03.281616+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abac53a0-2f3d-4aeb-8cbe-71673aae4f0a', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:03:03.572811+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd0a7c42-8a0e-40cc-b0fd-69b1de5b76c0', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:03:03.755004+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b72274a2-50cc-4f04-badf-7e890dbe0f3a', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:03:04.138325+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ec8c04b-1c64-4f1c-bbbc-c007ab58691e', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 09:03:40.115933+00', ''),
	('00000000-0000-0000-0000-000000000000', '5990e651-10a8-4fa8-a36a-7d6b3e0add92', '{"action":"login","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 09:03:53.779616+00', ''),
	('00000000-0000-0000-0000-000000000000', '73510254-2dc0-4215-ba1b-f20cc3aa9b05', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:44:09.4953+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0d547d2-18ea-45c8-a51d-38c45b771c20', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 09:44:09.504409+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f1c688f-bf88-44fa-89b9-678af1831643', '{"action":"token_refreshed","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 10:01:07.472181+00', ''),
	('00000000-0000-0000-0000-000000000000', '5279690f-5853-4d5f-ab29-3ddec597b4e6', '{"action":"token_revoked","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 10:01:07.487035+00', ''),
	('00000000-0000-0000-0000-000000000000', '43d4c0a2-f0d5-439f-8f22-2e9b52709ded', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 10:07:33.32654+00', ''),
	('00000000-0000-0000-0000-000000000000', 'edd8bf55-adf2-4a56-965b-20650741b822', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 10:07:43.888946+00', ''),
	('00000000-0000-0000-0000-000000000000', '4640c670-e7b0-4b9a-adf8-f933334b178c', '{"action":"logout","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 10:15:15.454522+00', ''),
	('00000000-0000-0000-0000-000000000000', '435065a2-507e-40e9-9a3a-cba9caaf37c2', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 10:15:41.982088+00', ''),
	('00000000-0000-0000-0000-000000000000', '985548fd-eb86-4830-a76d-86df581068d5', '{"action":"token_refreshed","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 10:17:53.272367+00', ''),
	('00000000-0000-0000-0000-000000000000', '55572458-cc3e-461f-9987-6133464efd07', '{"action":"token_revoked","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 10:17:53.273985+00', ''),
	('00000000-0000-0000-0000-000000000000', '841246c0-032c-4719-95c9-facb4159c582', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 10:26:10.749396+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca7c62ff-96ce-4706-87ae-24c1c4647e5f', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 10:26:18.528668+00', ''),
	('00000000-0000-0000-0000-000000000000', '86398428-6d45-49a1-8418-b1423af9b602', '{"action":"logout","actor_id":"1b69863f-48b3-4952-b5f6-727ac3fd24c2","actor_username":"hoangbaongan101@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 10:27:16.423727+00', ''),
	('00000000-0000-0000-0000-000000000000', '222d1dfa-578b-4d28-bde1-800e1d350b08', '{"action":"user_signedup","actor_id":"b8ad61c4-c4ef-4257-baa9-519b2198d618","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-13 10:27:47.150803+00', ''),
	('00000000-0000-0000-0000-000000000000', '6216a677-79b2-47ad-8b51-60b147e87b2c', '{"action":"login","actor_id":"b8ad61c4-c4ef-4257-baa9-519b2198d618","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 10:27:47.175574+00', ''),
	('00000000-0000-0000-0000-000000000000', '286bebeb-f33e-4152-a473-bdf552add39b', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"thuanh@gmail.com","user_id":"4fceb721-163a-4548-bad1-b14e3cd0dce7","user_phone":""}}', '2026-07-13 10:47:22.1402+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be9f201a-09a3-4779-89f2-eb65e709f955', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kian@gmail.com","user_id":"f545dcc9-d10f-4ae6-b8da-0cebac176699","user_phone":""}}', '2026-07-13 10:47:25.291958+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b424ed7-2513-4b1e-83e0-b18cdd58dd89', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"vivi@gmail.com","user_id":"b8ad61c4-c4ef-4257-baa9-519b2198d618","user_phone":""}}', '2026-07-13 10:47:28.585103+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bda63615-ed51-4e8c-8537-bcd8f7555b1d', '{"action":"user_signedup","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2026-07-13 10:49:04.139988+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce6bf864-48c0-49b1-8180-d95eafe11716', '{"action":"login","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 10:49:04.157927+00', ''),
	('00000000-0000-0000-0000-000000000000', 'caf7d0be-05b6-4fd8-ac9f-fde4d92a7a45', '{"action":"logout","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:01:16.09329+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6acee2e-edc2-4f2f-991f-5030f8c1d66d', '{"action":"login","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:01:58.673704+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a393c445-30ec-4b97-b9ea-a45a83e32c5e', '{"action":"logout","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:02:35.272669+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3e420d6-d597-46df-9c49-d254707e313c', '{"action":"login","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:02:55.469995+00', ''),
	('00000000-0000-0000-0000-000000000000', '6101749b-ffab-448a-8383-6db593de374a', '{"action":"logout","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:03:27.384721+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2ad072e-8246-46fb-94a0-f903a90c92c4', '{"action":"token_refreshed","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 11:24:51.191444+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a6c8478-2c77-4dbc-9d57-17043023176d', '{"action":"token_revoked","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"token"}', '2026-07-13 11:24:51.211868+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c65fb6a-74cd-40af-9502-8a26ec47ae8f', '{"action":"login","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:25:13.792862+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e32139d-de53-452b-9f6f-50b61b205ed8', '{"action":"logout","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:25:14.129107+00', ''),
	('00000000-0000-0000-0000-000000000000', '99889e05-f935-4451-b5ef-dfb5b889f536', '{"action":"login","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:25:30.697507+00', ''),
	('00000000-0000-0000-0000-000000000000', '66ecbd62-6cba-4e4f-a91e-a045ef72fdbb', '{"action":"logout","actor_id":"fa223def-ae4a-4bcc-990d-2b6d5b781a41","actor_username":"vivi@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:25:37.61259+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e08a23eb-fe96-4800-8d68-39c79baa0cb7', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000001","actor_username":"admin@joyride.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:38:25.843484+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c02de19-eeb8-4cf3-8b69-3fa49c570358', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:38:37.709086+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f8f00e6-a8ad-44b8-bab2-af9c2ae08183', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:41:07.91738+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f12406f5-e81c-4613-8bb3-40b1c494d21d', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:41:32.474708+00', ''),
	('00000000-0000-0000-0000-000000000000', '798932e1-d34a-4a64-a385-5cad04ac134e', '{"action":"logout","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:43:21.812325+00', ''),
	('00000000-0000-0000-0000-000000000000', '31ac437d-18ce-4844-9bc3-dd17341a43e2', '{"action":"login","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:43:38.559014+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bfb6ab3-54f8-4c20-9950-2b0421409f15', '{"action":"logout","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:45:34.992186+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9d9863e-1fea-463a-bf83-4a994aa67e78', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:45:45.516622+00', ''),
	('00000000-0000-0000-0000-000000000000', '44a0ab12-949d-4643-9fec-d7e15664b3b4', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:53:58.122512+00', ''),
	('00000000-0000-0000-0000-000000000000', '8693824f-19ec-4cfe-8bdc-6cf25a85b102', '{"action":"login","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:54:09.098738+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b14757d-efbe-4e73-8d11-a412d1348e4e', '{"action":"logout","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:54:23.21315+00', ''),
	('00000000-0000-0000-0000-000000000000', 'caaf4005-0be6-489f-92cf-508b269c4e4c', '{"action":"login","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:54:34.852656+00', ''),
	('00000000-0000-0000-0000-000000000000', '37bc6739-0d6e-4355-b2ac-b673e1f915a4', '{"action":"logout","actor_id":"fe9798da-502a-49c6-bc6b-317237d320c5","actor_username":"wonhee@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 11:54:39.010746+00', ''),
	('00000000-0000-0000-0000-000000000000', '987885a8-d135-42c0-a48c-744c561301d3', '{"action":"login","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 11:54:48.175224+00', ''),
	('00000000-0000-0000-0000-000000000000', '022998fe-9ce0-428f-bfd6-d2e00774233d', '{"action":"logout","actor_id":"c0437b96-ef92-44e1-a34a-233fc0f4eb58","actor_username":"yoona@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 12:00:31.747973+00', ''),
	('00000000-0000-0000-0000-000000000000', '14f59bd4-9763-4771-8d2c-aac5b9370587', '{"action":"login","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 12:00:41.375318+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a8fd591-43f5-4f39-9435-c211de9abb88', '{"action":"logout","actor_id":"00000000-0000-0000-0000-000000000002","actor_username":"hoangbaongan951@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-13 12:00:47.648442+00', ''),
	('00000000-0000-0000-0000-000000000000', '0cb84d68-a863-4c1b-a9cb-0de82ec4dad7', '{"action":"login","actor_id":"8c423376-b3a9-4cc5-ae81-db8e80e8cda1","actor_username":"iu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-13 12:00:57.678309+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('1abb1d76-bf73-4fbd-852d-b74db82d2d3a', '00000000-0000-0000-0000-000000000001', 'e3cd61cc-f45f-41fe-bd23-7cf2ddee8766', 's256', 'vuBYjmsxVfHLT-_KOFTyv1wOXNBVkY9Ai2bp9dsvA6s', 'recovery', '', '', '2026-07-12 10:55:05.659272+00', '2026-07-12 10:55:17.709165+00', 'recovery', '2026-07-12 10:55:17.709089+00', NULL, NULL, NULL, NULL, false),
	('12b143a0-0f5c-47bf-990b-5da624593476', '4fceb721-163a-4548-bad1-b14e3cd0dce7', '545ce558-0318-46ea-b84c-d11f86301d67', 's256', '_gnv1pHVDd5nIY-Aegi6QX-0fW1RKBPJ3Mqyy1CqKi4', 'email_change', '', '', '2026-07-13 07:03:04.560756+00', '2026-07-13 07:03:22.411487+00', 'email_change', '2026-07-13 07:03:22.411415+00', NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '9684ab27-9c41-4a71-a2a2-cd82900da161', 'authenticated', 'authenticated', 'somin@gmail.com', '$2a$06$Ry7GG178eRrMjfVHM9x1uOEC.GZBBYnYaOGHLfa/G2I9Vsyi5hyFO', '2026-07-13 03:56:00.25271+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Toàn Chiêu Mân", "is_staff": true}', NULL, '2026-07-13 03:56:00.25271+00', '2026-07-13 03:56:00.25271+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', 'authenticated', 'authenticated', 'taeyeon@gmail.com', '$2a$06$0FEMh3ySS5yYTnf3cLQ2MOVijqxDdYja/..Su5bAJjnkIJrvpkKt2', '2026-07-12 11:23:22.727394+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Kim Thái Nghiên", "is_staff": true}', NULL, '2026-07-12 11:23:22.727394+00', '2026-07-12 11:23:22.727394+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '8c423376-b3a9-4cc5-ae81-db8e80e8cda1', 'authenticated', 'authenticated', 'iu@gmail.com', '$2a$10$NAZ98Z4g2UBjYgYJABwWE.ZDcYmYRH3USf1hJz0OKZ6DlqL5xPs/a', '2026-07-12 12:18:28.717648+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 12:00:57.679962+00', '{"provider": "email", "providers": ["email"]}', '{"fullname": "Lý Tri Ân", "is_staff": true}', NULL, '2026-07-12 12:18:28.717648+00', '2026-07-13 12:00:57.686468+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '065811f5-f030-4352-905f-49d1a869150f', 'authenticated', 'authenticated', 'seonghyeon@gmail.com', '$2a$06$satLbKDlXvcYbTqPb7TXDul9qTCJSMLTNPiCdJkZ4J35rey.it6fG', '2026-07-12 11:25:53.278175+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Nghiêm Thành Huyền", "is_staff": true}', NULL, '2026-07-12 11:25:53.278175+00', '2026-07-12 11:25:53.278175+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bab2d2c1-852d-4956-a777-9942a2201a80', 'authenticated', 'authenticated', 'foryoung@gmail.com', '$2a$10$PkKUuNIVrIHtWtjPPGbUWeIKq.6NlK.DgdwHQ56eZmaPFbM89Kn9S', '2026-07-12 09:52:46.30151+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-12 09:56:15.424309+00', '{"provider": "email", "providers": ["email"]}', '{"fullname": "Trương Nguyên Anh", "is_staff": true}', NULL, '2026-07-12 09:52:46.30151+00', '2026-07-12 09:56:15.428216+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1a0fb49f-2137-469a-a3d3-443510e83b21', 'authenticated', 'authenticated', 'jiwoo@gmail.com', '$2a$06$0K/H0excxrCLz96jnumULOFYxUBOjA1W6bw3SXuBe8eBQYUOqHv6e', '2026-07-13 03:56:44.499894+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Toàn Chí Hữu", "is_staff": true}', NULL, '2026-07-13 03:56:44.499894+00', '2026-07-13 03:56:44.499894+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0d10bbac-3c77-4c70-8e5e-46c778ef9925', 'authenticated', 'authenticated', 'yunah@gmail.com', '$2a$06$/Lw4yLu9Ne0Ex.FCPscDrOD20LpYeK4NZAEUugVfvFRC.CHZ.jJjS', '2026-07-12 09:59:16.821123+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Lư Doãn Nga", "is_staff": true}', NULL, '2026-07-12 09:59:16.821123+00', '2026-07-12 09:59:16.821123+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c38e20a1-30ed-4175-b5a0-e0b887185205', 'authenticated', 'authenticated', 'minju@gmail.com', '$2a$06$CXQP6JhGynA/PzQiw5HQzevxbhKx.s8vmsa55w56fO3uw65zalCrW', '2026-07-12 10:01:24.947822+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Phác Mẫn Trụ", "is_staff": true}', NULL, '2026-07-12 10:01:24.947822+00', '2026-07-12 10:01:24.947822+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'fbac3ce7-848b-473b-9734-e43fe700d97c', 'authenticated', 'authenticated', 'moka@gmail.com', '$2a$06$xpwW6BDel8LgRwypyLKdd.x8jfY39t7Jz0txboNyNEa3ppSyviLh.', '2026-07-12 10:03:06.873734+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Cảnh Manh Hoa", "is_staff": true}', NULL, '2026-07-12 10:03:06.873734+00', '2026-07-12 10:03:06.873734+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f1d819b2-5901-4039-95e5-0e167c6e9d3c', 'authenticated', 'authenticated', 'iroha@gmail.com', '$2a$06$gnTxlyp1dt1lZbXFBBvpcO5RCIijkm1b74rflTj7AlH9m.yyxvT8m', '2026-07-12 10:05:30.469825+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Ngoại Viên Thái Vũ", "is_staff": true}', NULL, '2026-07-12 10:05:30.469825+00', '2026-07-12 10:05:30.469825+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a5b11d0c-7496-443b-b7ee-02f3279aa4b3', 'authenticated', 'authenticated', 'liz@gmail.com', '$2a$06$BqqKlC3l8ut/CawjuUxwuOuaYUbAl.GlQ7WEMxzTU1ptIIbm9UvgO', '2026-07-12 12:15:25.882018+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Kim Trí Viên", "is_staff": true}', NULL, '2026-07-12 12:15:25.882018+00', '2026-07-12 12:15:25.882018+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4b78548b-58c7-4c27-84db-7ee20aab4b88', 'authenticated', 'authenticated', 'james@gmail.com', '$2a$06$pFbuSaYtKElDtqufhRUCDOZvcGxe/O3Jo3utTASftvuWwdLp9lto6', '2026-07-12 12:20:31.060722+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Triệu Vũ Phàm", "is_staff": true}', NULL, '2026-07-12 12:20:31.060722+00', '2026-07-12 12:20:31.060722+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', 'authenticated', 'authenticated', 'keonho@gmail.com', '$2a$06$0d/gmR2V6.MsUjW0aAjKbO9a2iEavcDsnQcWaT/M1UR3sPlkWN8jS', '2026-07-12 12:23:46.594728+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "An Càn Hạo", "is_staff": true}', NULL, '2026-07-12 12:23:46.594728+00', '2026-07-12 12:23:46.594728+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7732a3e1-e0cd-433c-bc0d-e406a156c231', 'authenticated', 'authenticated', 'jessica@gmail.com', '$2a$06$PrYv5ClQmDBl8mKpVYg/7e6zAlehxHoTi5D9JsH46TI5pxx.VIu/C', '2026-07-12 12:28:34.323175+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Trịnh Tú Nghiên", "is_staff": true}', NULL, '2026-07-12 12:28:34.323175+00', '2026-07-12 12:28:34.323175+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'dbf7fadf-a4f6-47ee-bacd-3128c5c62859', 'authenticated', 'authenticated', 'seph@gmail.com', '$2a$06$9NMg4gNDxDSPbSBEM5UR9.ipoRVsvLkwQRd7FggW/4f5OmopKGPeW', '2026-07-13 03:59:34.827979+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Kim Thái Hanh", "is_staff": true}', NULL, '2026-07-13 03:59:34.827979+00', '2026-07-13 03:59:34.827979+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a1170ea5-18db-4f8e-bd80-68b55780d483', 'authenticated', 'authenticated', 'matthew@gmail.com', '$2a$06$ybR/I.wH56EKBwrUh3PEtusoMlAgpUzJuc/xsik3Tu5BHqDE7MM16', '2026-07-13 04:00:21.620851+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Kim Trân Tích", "is_staff": true}', NULL, '2026-07-13 04:00:21.620851+00', '2026-07-13 04:00:21.620851+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'fe9798da-502a-49c6-bc6b-317237d320c5', 'authenticated', 'authenticated', 'wonhee@gmail.com', '$2a$10$fhpcdvB3nlH.8ADdja3ineJ524HGkNZ0IReVy57V7SUVPxbwtEGay', '2026-07-12 10:04:20.604208+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 11:54:34.854384+00', '{"provider": "email", "providers": ["email"]}', '{"fullname": "Lý Nguyên Hi", "is_staff": true}', NULL, '2026-07-12 10:04:20.604208+00', '2026-07-13 11:54:34.858665+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@joyride.com', '$2a$10$Q.XpYrsW.Qudbmh4AZaKde6VkHbB9rf.8vLlKelQ0yabgEw5qWdKq', '2026-07-12 06:20:22.841704+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 10:26:18.531284+00', '{"provider": "email", "providers": ["email"]}', '{"fullname": "Quản trị viên", "is_staff": true}', NULL, '2026-07-12 09:44:28.626103+00', '2026-07-13 11:24:51.250794+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c0437b96-ef92-44e1-a34a-233fc0f4eb58', 'authenticated', 'authenticated', 'yoona@gmail.com', '$2a$10$Y7rjBtpd0ceVV.35d8l8kO0wKljRtU2coHFDe99XdB0NtLmIILcwW', '2026-07-12 12:26:33.451845+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 11:54:48.17811+00', '{"provider": "email", "providers": ["email"]}', '{"fullname": "Lâm Duẫn Nhi", "is_staff": true}', NULL, '2026-07-12 12:26:33.451845+00', '2026-07-13 11:54:48.18792+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'hoangbaongan951@gmail.com', '$2a$06$4ncuIe/BRVllvajk6/pSvuixnUyA6ax1lFSbQkb57G3bSBv4yqo5O', '2026-07-12 06:27:32.780422+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 12:00:41.377036+00', '{"provider": "email", "providers": ["email"]}', '{"fullname": "Hoang Bao Ngan", "is_staff": true}', NULL, '2026-07-12 09:44:28.626103+00', '2026-07-13 12:00:41.383365+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bf97031d-96ba-4ce1-a0a2-8332866774a1', 'authenticated', 'authenticated', 'yuri@gmail.com', '$2a$06$jJUpx0KM.6oA8Ns5wG8xCuGM7d69aGh97XXkeouE2I3MSTONrIzN.', '2026-07-13 04:09:29.186918+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Quyền Du Lợi", "is_staff": true}', NULL, '2026-07-13 04:09:29.186918+00', '2026-07-13 04:09:29.186918+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'cc6cb3e0-ef51-4b7c-9613-a19876ece007', 'authenticated', 'authenticated', 'sooyoung@gmail.com', '$2a$06$TthrrMXuCxe1.bSI10zPSuKaQfiux7KVLdAUDxshE4NvUHYEHOO/.', '2026-07-13 04:11:27.305233+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Thôi Tú Anh", "is_staff": true}', NULL, '2026-07-13 04:11:27.305233+00', '2026-07-13 04:11:27.305233+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2ef4b03d-6435-4064-8bb4-c550150795cc', 'authenticated', 'authenticated', 'martin@gmail.com', '$2a$06$bG7kFLVBXluwMYDYX6PN1ug4Q7Ymyj8IBdUG92L9TL0e/ketuZLqq', '2026-07-13 04:14:29.487745+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Phác Vũ Trụ", "is_staff": true}', NULL, '2026-07-13 04:14:29.487745+00', '2026-07-13 04:14:29.487745+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '01cb981d-1c8a-4266-8e12-653519496038', 'authenticated', 'authenticated', 'juhoon@gmail.com', '$2a$06$2B1j/LNSzrryKlQ7.As9WehRgZNfEWUrxbnSPO74jdNacbzMp.nCa', '2026-07-13 04:15:32.231852+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Kim Chủ Huấn", "is_staff": true}', NULL, '2026-07-13 04:15:32.231852+00', '2026-07-13 04:15:32.231852+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '7028271c-8032-4683-8ee5-44aa3134412d', 'authenticated', 'authenticated', 'hoanganh@gmail.com', '$2a$06$W0/T/N3PN/9V6mszR73MI.QZr7H/YH3.QIE9.bTmaOhhw2vLHeN/W', '2026-07-13 10:06:53.751417+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"fullname": "Ruby Joseph Kim", "is_staff": true}', NULL, '2026-07-13 10:06:53.751417+00', '2026-07-13 10:06:53.751417+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1b69863f-48b3-4952-b5f6-727ac3fd24c2', 'authenticated', 'authenticated', 'hoangbaongan101@gmail.com', '$2a$10$w3Xi9fvFGYkM5Z.nw6UFYeF7QC9v/CZw3Ex6pL6K80EqscjBg91sa', '2026-07-12 10:32:25.590191+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 09:03:53.782206+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1b69863f-48b3-4952-b5f6-727ac3fd24c2", "email": "hoangbaongan101@gmail.com", "fullname": "Ngân Ngân", "email_verified": true, "phone_verified": false}', NULL, '2026-07-12 10:32:25.50753+00', '2026-07-13 10:17:53.278948+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'fa223def-ae4a-4bcc-990d-2b6d5b781a41', 'authenticated', 'authenticated', 'vivi@gmail.com', '$2a$10$tn4nLwzavm43qopXyb2IZe6x.MPS9kiw7oAsokS7ydbPdfnAhLMkq', '2026-07-13 10:49:04.142065+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-13 11:25:30.69914+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "fa223def-ae4a-4bcc-990d-2b6d5b781a41", "email": "vivi@gmail.com", "fullname": "Bối Vy Vy", "email_verified": true, "phone_verified": false}', NULL, '2026-07-13 10:49:04.111798+00', '2026-07-13 11:25:30.703387+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub": "00000000-0000-0000-0000-000000000001", "email": "admin@joyride.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 09:44:28.626103+00', '2026-07-12 09:44:28.626103+00', '2026-07-12 09:44:28.626103+00', '9071686a-c9e3-4ffc-945b-1229694dc16b'),
	('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub": "00000000-0000-0000-0000-000000000002", "email": "hoangbaongan951@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 09:44:28.626103+00', '2026-07-12 09:44:28.626103+00', '2026-07-12 09:44:28.626103+00', 'cf1ba0a4-c3a3-4bde-87eb-0c5f705f40ae'),
	('bab2d2c1-852d-4956-a777-9942a2201a80', 'bab2d2c1-852d-4956-a777-9942a2201a80', '{"sub": "bab2d2c1-852d-4956-a777-9942a2201a80", "email": "foryoung@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 09:52:46.30151+00', '2026-07-12 09:52:46.30151+00', '2026-07-12 09:52:46.30151+00', 'd44b7e0e-4b74-4d34-9620-a8fbe703856e'),
	('0d10bbac-3c77-4c70-8e5e-46c778ef9925', '0d10bbac-3c77-4c70-8e5e-46c778ef9925', '{"sub": "0d10bbac-3c77-4c70-8e5e-46c778ef9925", "email": "yunah@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 09:59:16.821123+00', '2026-07-12 09:59:16.821123+00', '2026-07-12 09:59:16.821123+00', '1144e9f8-b3ce-488c-90b7-95dfe15f974a'),
	('c38e20a1-30ed-4175-b5a0-e0b887185205', 'c38e20a1-30ed-4175-b5a0-e0b887185205', '{"sub": "c38e20a1-30ed-4175-b5a0-e0b887185205", "email": "minju@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 10:01:24.947822+00', '2026-07-12 10:01:24.947822+00', '2026-07-12 10:01:24.947822+00', 'abecfcb5-002d-4e29-9c46-8ad8ece50980'),
	('fbac3ce7-848b-473b-9734-e43fe700d97c', 'fbac3ce7-848b-473b-9734-e43fe700d97c', '{"sub": "fbac3ce7-848b-473b-9734-e43fe700d97c", "email": "moka@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 10:03:06.873734+00', '2026-07-12 10:03:06.873734+00', '2026-07-12 10:03:06.873734+00', '29859b34-9f30-4d4d-a87d-81267fa20e7c'),
	('fe9798da-502a-49c6-bc6b-317237d320c5', 'fe9798da-502a-49c6-bc6b-317237d320c5', '{"sub": "fe9798da-502a-49c6-bc6b-317237d320c5", "email": "wonhee@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 10:04:20.604208+00', '2026-07-12 10:04:20.604208+00', '2026-07-12 10:04:20.604208+00', 'd3832726-b98e-4855-813b-35b3d65bf0ea'),
	('f1d819b2-5901-4039-95e5-0e167c6e9d3c', 'f1d819b2-5901-4039-95e5-0e167c6e9d3c', '{"sub": "f1d819b2-5901-4039-95e5-0e167c6e9d3c", "email": "iroha@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 10:05:30.469825+00', '2026-07-12 10:05:30.469825+00', '2026-07-12 10:05:30.469825+00', '6e8b657a-3f05-4af5-aec0-bc3f15ca7894'),
	('1b69863f-48b3-4952-b5f6-727ac3fd24c2', '1b69863f-48b3-4952-b5f6-727ac3fd24c2', '{"sub": "1b69863f-48b3-4952-b5f6-727ac3fd24c2", "email": "hoangbaongan101@gmail.com", "fullname": "KNgan", "email_verified": false, "phone_verified": false}', 'email', '2026-07-12 10:32:25.575755+00', '2026-07-12 10:32:25.575859+00', '2026-07-12 10:32:25.575859+00', '9effecfd-9bf5-4ebe-b637-1e29092adcb6'),
	('a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', 'a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', '{"sub": "a2dccfcf-3eb1-46bd-b904-102b3f6d0f72", "email": "taeyeon@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 11:23:22.727394+00', '2026-07-12 11:23:22.727394+00', '2026-07-12 11:23:22.727394+00', '88f6cdc2-424f-4c5e-89a3-164ad33da7fc'),
	('065811f5-f030-4352-905f-49d1a869150f', '065811f5-f030-4352-905f-49d1a869150f', '{"sub": "065811f5-f030-4352-905f-49d1a869150f", "email": "seonghyeon@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 11:25:53.278175+00', '2026-07-12 11:25:53.278175+00', '2026-07-12 11:25:53.278175+00', 'c1b47272-f8bc-4ecb-ac1d-d98cc7a866b9'),
	('a5b11d0c-7496-443b-b7ee-02f3279aa4b3', 'a5b11d0c-7496-443b-b7ee-02f3279aa4b3', '{"sub": "a5b11d0c-7496-443b-b7ee-02f3279aa4b3", "email": "liz@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 12:15:25.882018+00', '2026-07-12 12:15:25.882018+00', '2026-07-12 12:15:25.882018+00', '4cb03174-caff-439c-9dbd-2bd7cfbff8f6'),
	('8c423376-b3a9-4cc5-ae81-db8e80e8cda1', '8c423376-b3a9-4cc5-ae81-db8e80e8cda1', '{"sub": "8c423376-b3a9-4cc5-ae81-db8e80e8cda1", "email": "iu@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 12:18:28.717648+00', '2026-07-12 12:18:28.717648+00', '2026-07-12 12:18:28.717648+00', 'd53c9bce-b5a8-42e7-bd0b-e8a29fbdc789'),
	('4b78548b-58c7-4c27-84db-7ee20aab4b88', '4b78548b-58c7-4c27-84db-7ee20aab4b88', '{"sub": "4b78548b-58c7-4c27-84db-7ee20aab4b88", "email": "james@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 12:20:31.060722+00', '2026-07-12 12:20:31.060722+00', '2026-07-12 12:20:31.060722+00', 'cd48e1d5-51af-499b-a303-fef7f7127a8c'),
	('c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', 'c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', '{"sub": "c6ac5976-6b1c-4cee-ad0c-72c01e8ee763", "email": "keonho@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 12:23:46.594728+00', '2026-07-12 12:23:46.594728+00', '2026-07-12 12:23:46.594728+00', '4c48c035-c41f-4952-bd63-c0517a2ec7d8'),
	('c0437b96-ef92-44e1-a34a-233fc0f4eb58', 'c0437b96-ef92-44e1-a34a-233fc0f4eb58', '{"sub": "c0437b96-ef92-44e1-a34a-233fc0f4eb58", "email": "yoona@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 12:26:33.451845+00', '2026-07-12 12:26:33.451845+00', '2026-07-12 12:26:33.451845+00', 'e498064a-6d84-4e87-b5ec-38d02c0c41a9'),
	('7732a3e1-e0cd-433c-bc0d-e406a156c231', '7732a3e1-e0cd-433c-bc0d-e406a156c231', '{"sub": "7732a3e1-e0cd-433c-bc0d-e406a156c231", "email": "jessica@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-12 12:28:34.323175+00', '2026-07-12 12:28:34.323175+00', '2026-07-12 12:28:34.323175+00', '3c0b7803-2e95-4fd8-975b-8e7efa9cbeac'),
	('9684ab27-9c41-4a71-a2a2-cd82900da161', '9684ab27-9c41-4a71-a2a2-cd82900da161', '{"sub": "9684ab27-9c41-4a71-a2a2-cd82900da161", "email": "somin@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 03:56:00.25271+00', '2026-07-13 03:56:00.25271+00', '2026-07-13 03:56:00.25271+00', '1cc7b46e-6916-4a12-9044-f1306aaca3a6'),
	('1a0fb49f-2137-469a-a3d3-443510e83b21', '1a0fb49f-2137-469a-a3d3-443510e83b21', '{"sub": "1a0fb49f-2137-469a-a3d3-443510e83b21", "email": "jiwoo@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 03:56:44.499894+00', '2026-07-13 03:56:44.499894+00', '2026-07-13 03:56:44.499894+00', 'a6797c01-7928-4219-9ded-fb6d6c4e542c'),
	('dbf7fadf-a4f6-47ee-bacd-3128c5c62859', 'dbf7fadf-a4f6-47ee-bacd-3128c5c62859', '{"sub": "dbf7fadf-a4f6-47ee-bacd-3128c5c62859", "email": "seph@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 03:59:34.827979+00', '2026-07-13 03:59:34.827979+00', '2026-07-13 03:59:34.827979+00', '4d750fb7-c3d7-4213-963c-269736d5694f'),
	('a1170ea5-18db-4f8e-bd80-68b55780d483', 'a1170ea5-18db-4f8e-bd80-68b55780d483', '{"sub": "a1170ea5-18db-4f8e-bd80-68b55780d483", "email": "matthew@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 04:00:21.620851+00', '2026-07-13 04:00:21.620851+00', '2026-07-13 04:00:21.620851+00', 'ea020f61-814c-44df-8ace-904301d03a94'),
	('bf97031d-96ba-4ce1-a0a2-8332866774a1', 'bf97031d-96ba-4ce1-a0a2-8332866774a1', '{"sub": "bf97031d-96ba-4ce1-a0a2-8332866774a1", "email": "yuri@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 04:09:29.186918+00', '2026-07-13 04:09:29.186918+00', '2026-07-13 04:09:29.186918+00', '03a74e92-11ee-41bd-a345-4669b81edc63'),
	('cc6cb3e0-ef51-4b7c-9613-a19876ece007', 'cc6cb3e0-ef51-4b7c-9613-a19876ece007', '{"sub": "cc6cb3e0-ef51-4b7c-9613-a19876ece007", "email": "sooyoung@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 04:11:27.305233+00', '2026-07-13 04:11:27.305233+00', '2026-07-13 04:11:27.305233+00', 'd06d9597-e711-4474-bddb-c8de95a422b4'),
	('2ef4b03d-6435-4064-8bb4-c550150795cc', '2ef4b03d-6435-4064-8bb4-c550150795cc', '{"sub": "2ef4b03d-6435-4064-8bb4-c550150795cc", "email": "martin@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 04:14:29.487745+00', '2026-07-13 04:14:29.487745+00', '2026-07-13 04:14:29.487745+00', 'a1873fdc-6a6b-4486-86f1-aea9ddbab5c7'),
	('01cb981d-1c8a-4266-8e12-653519496038', '01cb981d-1c8a-4266-8e12-653519496038', '{"sub": "01cb981d-1c8a-4266-8e12-653519496038", "email": "juhoon@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 04:15:32.231852+00', '2026-07-13 04:15:32.231852+00', '2026-07-13 04:15:32.231852+00', '8e823b4e-35b3-4198-bbcd-089d939aa82d'),
	('fa223def-ae4a-4bcc-990d-2b6d5b781a41', 'fa223def-ae4a-4bcc-990d-2b6d5b781a41', '{"sub": "fa223def-ae4a-4bcc-990d-2b6d5b781a41", "email": "vivi@gmail.com", "fullname": "Bối Vy Vy", "email_verified": false, "phone_verified": false}', 'email', '2026-07-13 10:49:04.134359+00', '2026-07-13 10:49:04.134401+00', '2026-07-13 10:49:04.134401+00', '4fe2b847-4850-413f-b4d1-d1771bd627a2'),
	('7028271c-8032-4683-8ee5-44aa3134412d', '7028271c-8032-4683-8ee5-44aa3134412d', '{"sub": "7028271c-8032-4683-8ee5-44aa3134412d", "email": "hoanganh@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-07-13 10:06:53.751417+00', '2026-07-13 10:06:53.751417+00', '2026-07-13 10:06:53.751417+00', 'f5181b20-cc24-4da6-a9e2-8a569c6f62ff');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('ff6ce8f1-b823-4509-839d-149fc3e8edc5', '8c423376-b3a9-4cc5-ae81-db8e80e8cda1', '2026-07-13 12:00:57.680045+00', '2026-07-13 12:00:57.680045+00', NULL, 'aal1', NULL, NULL, 'node', '172.18.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('ff6ce8f1-b823-4509-839d-149fc3e8edc5', '2026-07-13 12:00:57.687365+00', '2026-07-13 12:00:57.687365+00', 'password', 'ebbe4584-af73-4a7e-b5e7-75158035d9e8');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 104, 'yij6s2k5t3g3', '8c423376-b3a9-4cc5-ae81-db8e80e8cda1', false, '2026-07-13 12:00:57.684418+00', '2026-07-13 12:00:57.684418+00', NULL, 'ff6ce8f1-b823-4509-839d-149fc3e8edc5');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "created_at", "avatar", "gender", "dob", "phone", "address", "email", "updated_at", "fullname") VALUES
	('a1170ea5-18db-4f8e-bd80-68b55780d483', '2026-07-13 04:00:21.620851+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/a1170ea5-18db-4f8e-bd80-68b55780d483-1783915378210.JPG', 'male', '2002-10-20', '0420101992', 'DSP Media', 'matthew@gmail.com', '2026-07-13 04:00:21.620851+00', 'Kim Trân Tích'),
	('9684ab27-9c41-4a71-a2a2-cd82900da161', '2026-07-13 03:56:00.25271+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/9684ab27-9c41-4a71-a2a2-cd82900da161-1783915430693.JPG', 'female', '2006-08-22', '0422081996', 'DSP Media', 'somin@gmail.com', '2026-07-13 03:56:00.25271+00', 'Toàn Chiêu Mân'),
	('1a0fb49f-2137-469a-a3d3-443510e83b21', '2026-07-13 03:56:44.499894+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/1a0fb49f-2137-469a-a3d3-443510e83b21-1783915463289.JPG', 'female', '2006-10-04', '0404101996', 'DSP Media', 'jiwoo@gmail.com', '2026-07-13 03:56:44.499894+00', 'Toàn Chí Hữu'),
	('0d10bbac-3c77-4c70-8e5e-46c778ef9925', '2026-07-12 09:59:16.821123+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/0d10bbac-3c77-4c70-8e5e-46c778ef9925-1783850432865.PNG', 'female', '2004-01-15', '0515012004', 'Belift Lab Inc.', 'yunah@gmail.com', '2026-07-12 09:59:16.821123+00', 'Lư Doãn Nga'),
	('c38e20a1-30ed-4175-b5a0-e0b887185205', '2026-07-12 10:01:24.947822+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/c38e20a1-30ed-4175-b5a0-e0b887185205-1783850557951.PNG', 'female', '2004-05-11', '0511052004', 'Belift Lab Inc.', 'minju@gmail.com', '2026-07-12 10:01:24.947822+00', 'Phác Mẫn Trụ'),
	('4b78548b-58c7-4c27-84db-7ee20aab4b88', '2026-07-12 12:20:31.060722+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/4b78548b-58c7-4c27-84db-7ee20aab4b88-1783858860506.PNG', 'male', '2005-10-14', '0514102005', 'Big Hit Entertainment', 'james@gmail.com', '2026-07-12 12:20:31.060722+00', 'Triệu Vũ Phàm'),
	('fbac3ce7-848b-473b-9734-e43fe700d97c', '2026-07-12 10:03:06.873734+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/fbac3ce7-848b-473b-9734-e43fe700d97c-1783850615177.PNG', 'female', '2004-10-08', '0508102004', 'Belift Lab Inc.', 'moka@gmail.com', '2026-07-12 10:03:06.873734+00', 'Cảnh Manh Hoa'),
	('c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', '2026-07-12 12:23:46.594728+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/c6ac5976-6b1c-4cee-ad0c-72c01e8ee763-1783859063347.JPG', 'male', '2009-02-14', '0514022009', 'Big Hit Entertainment', 'keonho@gmail.com', '2026-07-12 12:23:46.594728+00', 'An Càn Hạo'),
	('fe9798da-502a-49c6-bc6b-317237d320c5', '2026-07-12 10:04:20.604208+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/fe9798da-502a-49c6-bc6b-317237d320c5-1783850694059.PNG', 'female', '2007-06-26', '0526062007', 'Belift Lab Inc.', 'wonhee@gmail.com', '2026-07-12 10:04:20.604208+00', 'Lý Nguyên Hi'),
	('f1d819b2-5901-4039-95e5-0e167c6e9d3c', '2026-07-12 10:05:30.469825+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/f1d819b2-5901-4039-95e5-0e167c6e9d3c-1783850756656.PNG', 'female', '2008-02-04', '0504022008', 'Belift Lab Inc.', 'iroha@gmail.com', '2026-07-12 10:05:30.469825+00', 'Ngoại Viên Thái Vũ'),
	('01cb981d-1c8a-4266-8e12-653519496038', '2026-07-13 04:15:32.231852+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/01cb981d-1c8a-4266-8e12-653519496038-1783916162714.JPG', 'male', '2008-01-03', '0503012008', 'Big Hit Entertainment', 'juhoon@gmail.com', '2026-07-13 04:15:32.231852+00', 'Kim Chủ Huấn'),
	('bf97031d-96ba-4ce1-a0a2-8332866774a1', '2026-07-13 04:09:29.186918+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/bf97031d-96ba-4ce1-a0a2-8332866774a1-1783915841083.JPG', 'female', '1999-12-05', '0805121989', 'SM Entertainment Co., Ltd.', 'yuri@gmail.com', '2026-07-13 04:09:29.186918+00', 'Quyền Du Lợi'),
	('a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', '2026-07-12 11:23:22.727394+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/a2dccfcf-3eb1-46bd-b904-102b3f6d0f72-1783855481413.JPG', 'female', '1999-03-09', '0809031989', 'SM Entertainment Co., Ltd.', 'taeyeon@gmail.com', '2026-07-12 11:23:22.727394+00', 'Kim Thái Nghiên'),
	('c0437b96-ef92-44e1-a34a-233fc0f4eb58', '2026-07-12 12:26:33.451845+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/c0437b96-ef92-44e1-a34a-233fc0f4eb58-1783859239635.JPG', 'female', '2000-05-30', '0830051990', 'SM Entertainment Co., Ltd.', 'yoona@gmail.com', '2026-07-12 12:26:33.451845+00', 'Lâm Duẫn Nhi'),
	('065811f5-f030-4352-905f-49d1a869150f', '2026-07-12 11:25:53.278175+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/065811f5-f030-4352-905f-49d1a869150f-1783855592159.PNG', 'male', '2009-01-13', '0513012009', 'Big Hit Entertainment', 'seonghyeon@gmail.com', '2026-07-12 11:25:53.278175+00', 'Nghiêm Thành Huyền'),
	('1b69863f-48b3-4952-b5f6-727ac3fd24c2', '2026-07-12 10:32:25.505642+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/1b69863f-48b3-4952-b5f6-727ac3fd24c2_1783933473847.png', 'female', NULL, '', '132 LT5', 'hoangbaongan101@gmail.com', '2026-07-12 10:32:25.505642+00', 'Ngân Kim'),
	('cc6cb3e0-ef51-4b7c-9613-a19876ece007', '2026-07-13 04:11:27.305233+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/cc6cb3e0-ef51-4b7c-9613-a19876ece007-1783915915776.JPG', 'female', '1999-02-10', '0810021990', 'SM Entertainment Co., Ltd.', 'sooyoung@gmail.com', '2026-07-13 04:11:27.305233+00', 'Thôi Tú Anh'),
	('7732a3e1-e0cd-433c-bc0d-e406a156c231', '2026-07-12 12:28:34.323175+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/7732a3e1-e0cd-433c-bc0d-e406a156c231-1783859361730.JPG', 'female', '1999-04-18', '0918041989', 'Blanc & Eclare', 'jessica@gmail.com', '2026-07-12 12:28:34.323175+00', 'Trịnh Tú Nghiên'),
	('00000000-0000-0000-0000-000000000001', '2026-07-12 06:28:16.987138+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/00000000-0000-0000-0000-000000000001/avatar-1783867077086.jpg', 'female', '2001-01-04', '', 'DH51901114', 'admin@joyride.com', '2026-07-12 06:28:16.987138+00', 'Quản trị viên'),
	('bab2d2c1-852d-4956-a777-9942a2201a80', '2026-07-12 09:52:46.30151+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/bab2d2c1-852d-4956-a777-9942a2201a80-1783858418178.JPG', 'female', '2004-08-31', '0831082004', 'Starship Entertainment', 'foryoung@gmail.com', '2026-07-12 09:52:46.30151+00', 'Trương Nguyên Anh'),
	('a5b11d0c-7496-443b-b7ee-02f3279aa4b3', '2026-07-12 12:15:25.882018+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/a5b11d0c-7496-443b-b7ee-02f3279aa4b3-1783858605605.PNG', 'female', '2004-11-22', '0822112004', 'Starship Entertainment', 'liz@gmail.com', '2026-07-12 12:15:25.882018+00', 'Kim Trí Viên'),
	('8c423376-b3a9-4cc5-ae81-db8e80e8cda1', '2026-07-12 12:18:28.717648+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/8c423376-b3a9-4cc5-ae81-db8e80e8cda1-1783858764198.JPG', 'female', '2003-05-16', '0116052003', 'Kakao Entertainment', 'iu@gmail.com', '2026-07-12 12:18:28.717648+00', 'Lý Tri Ân'),
	('fa223def-ae4a-4bcc-990d-2b6d5b781a41', '2026-07-13 10:49:04.111397+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/customers/fa223def-ae4a-4bcc-990d-2b6d5b781a41/avatar-1783942779909.jpg', 'female', NULL, '', '', 'vivi@gmail.com', '2026-07-13 10:49:04.111397+00', 'Bối Vy Vy'),
	('00000000-0000-0000-0000-000000000002', '2026-07-12 06:27:32.780422+00', NULL, 'female', '2001-01-04', '', 'DH51901114', 'hoangbaongan951@gmail.com', '2026-07-12 06:27:32.780422+00', 'Hoang Bao Ngan'),
	('dbf7fadf-a4f6-47ee-bacd-3128c5c62859', '2026-07-13 03:59:34.827979+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/dbf7fadf-a4f6-47ee-bacd-3128c5c62859-1783915343811.JPG', 'male', '2002-06-21', '0421061992', 'DSP Media', 'seph@gmail.com', '2026-07-13 03:59:34.827979+00', 'Kim Thái Hanh'),
	('2ef4b03d-6435-4064-8bb4-c550150795cc', '2026-07-13 04:14:29.487745+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/2ef4b03d-6435-4064-8bb4-c550150795cc-1783916103265.PNG', 'male', '2008-03-20', '0520032008', 'Big Hit Entertainment', 'martin@gmail.com', '2026-07-13 04:14:29.487745+00', 'Phác Vũ Trụ'),
	('7028271c-8032-4683-8ee5-44aa3134412d', '2026-07-13 10:06:53.751417+00', 'http://127.0.0.1:54321/storage/v1/object/public/avatars/7028271c-8032-4683-8ee5-44aa3134412d-1783937227432.jpg', 'female', NULL, '0909377435', NULL, 'hoanganh@gmail.com', '2026-07-13 10:06:53.751417+00', 'Ruby Joseph Kim');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "created_at", "status", "updated_at") VALUES
	('1b69863f-48b3-4952-b5f6-727ac3fd24c2', '2026-07-12 10:32:25.505642+00', 'active', '2026-07-12 10:32:25.505642+00'),
	('fa223def-ae4a-4bcc-990d-2b6d5b781a41', '2026-07-13 10:49:04.111397+00', 'active', '2026-07-13 10:49:04.111397+00');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "created_at", "role_name", "updated_at") OVERRIDING SYSTEM VALUE VALUES
	(1, '2026-07-03 18:12:26.764143+00', 'Admin', '2026-07-03 18:12:26.764143+00'),
	(2, '2026-07-03 18:12:38.478724+00', 'CEO', '2026-07-03 18:12:38.478724+00'),
	(3, '2026-07-03 18:12:51.31991+00', 'Manager', '2026-07-03 18:12:51.31991+00'),
	(4, '2026-07-03 18:13:05.707282+00', 'Beautician', '2026-07-03 18:13:05.707282+00'),
	(5, '2026-07-03 18:13:19.152354+00', 'Receptionist', '2026-07-03 18:13:19.152354+00');


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "created_at", "role_id", "updated_at", "status", "certificate_name", "level", "joined_at") VALUES
	('0d10bbac-3c77-4c70-8e5e-46c778ef9925', '2026-07-12 09:59:16.956032+00', 5, '2026-07-12 09:59:16.956032+00', 'active', NULL, NULL, '2025-03-25'),
	('c38e20a1-30ed-4175-b5a0-e0b887185205', '2026-07-12 10:01:25.016051+00', 5, '2026-07-12 10:01:25.016051+00', 'active', NULL, NULL, '2025-03-25'),
	('fbac3ce7-848b-473b-9734-e43fe700d97c', '2026-07-12 10:03:06.905069+00', 5, '2026-07-12 10:03:06.905069+00', 'active', NULL, NULL, '2025-03-25'),
	('fe9798da-502a-49c6-bc6b-317237d320c5', '2026-07-12 10:04:20.659287+00', 5, '2026-07-12 10:04:20.659287+00', 'active', NULL, NULL, '2025-03-25'),
	('f1d819b2-5901-4039-95e5-0e167c6e9d3c', '2026-07-12 10:05:30.52895+00', 5, '2026-07-12 10:05:30.52895+00', 'active', NULL, NULL, '2025-03-25'),
	('a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', '2026-07-12 11:23:22.839955+00', 4, '2026-07-12 11:23:22.839955+00', 'active', 'Master', 'Chuyên gia', '2025-08-05'),
	('065811f5-f030-4352-905f-49d1a869150f', '2026-07-12 11:25:53.337927+00', 4, '2026-07-12 11:25:53.337927+00', 'active', 'Quốc tế', 'Chuyên gia', '2025-08-18'),
	('bab2d2c1-852d-4956-a777-9942a2201a80', '2026-07-12 09:52:46.377794+00', 3, '2026-07-12 09:52:46.377794+00', 'active', NULL, NULL, '2025-11-02'),
	('a5b11d0c-7496-443b-b7ee-02f3279aa4b3', '2026-07-12 12:15:26.003663+00', 3, '2026-07-12 12:15:26.003663+00', 'active', NULL, NULL, '2025-11-02'),
	('8c423376-b3a9-4cc5-ae81-db8e80e8cda1', '2026-07-12 12:18:28.775216+00', 3, '2026-07-12 12:18:28.775216+00', 'active', NULL, NULL, '2025-08-20'),
	('4b78548b-58c7-4c27-84db-7ee20aab4b88', '2026-07-12 12:20:31.109466+00', 4, '2026-07-12 12:20:31.109466+00', 'active', 'Master', 'Chuyên gia', '2025-08-18'),
	('c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', '2026-07-12 12:23:46.657482+00', 4, '2026-07-12 12:23:46.657482+00', 'active', 'Master', 'Cao cấp', '2025-08-18'),
	('c0437b96-ef92-44e1-a34a-233fc0f4eb58', '2026-07-12 12:26:33.514998+00', 4, '2026-07-12 12:26:33.514998+00', 'active', 'Master', 'Cao cấp', '2025-08-05'),
	('7732a3e1-e0cd-433c-bc0d-e406a156c231', '2026-07-12 12:28:34.38294+00', 4, '2026-07-12 12:28:34.38294+00', 'active', 'Quốc tế', 'Chuyên gia', '2025-08-05'),
	('00000000-0000-0000-0000-000000000001', '2026-07-12 06:28:16.987138+00', 1, '2026-07-12 06:28:16.987138+00', 'active', '', '', '2025-04-30'),
	('dbf7fadf-a4f6-47ee-bacd-3128c5c62859', '2026-07-13 03:59:34.87315+00', 4, '2026-07-13 03:59:34.87315+00', 'active', 'Quốc tế', 'Cao cấp', '2025-07-19'),
	('a1170ea5-18db-4f8e-bd80-68b55780d483', '2026-07-13 04:00:21.66177+00', 4, '2026-07-13 04:00:21.66177+00', 'active', 'Quốc tế', 'Cao cấp', '2025-07-19'),
	('9684ab27-9c41-4a71-a2a2-cd82900da161', '2026-07-13 03:56:00.324961+00', 4, '2026-07-13 03:56:00.324961+00', 'active', 'Quốc tế', 'Cao cấp', '2025-07-19'),
	('1a0fb49f-2137-469a-a3d3-443510e83b21', '2026-07-13 03:56:44.541813+00', 4, '2026-07-13 03:56:44.541813+00', 'active', 'Quốc tế', 'Cao cấp', '2025-07-19'),
	('bf97031d-96ba-4ce1-a0a2-8332866774a1', '2026-07-13 04:09:29.252387+00', 4, '2026-07-13 04:09:29.252387+00', 'active', 'Master', 'Chuyên gia', '2025-08-05'),
	('cc6cb3e0-ef51-4b7c-9613-a19876ece007', '2026-07-13 04:11:27.351609+00', 4, '2026-07-13 04:11:27.351609+00', 'active', 'Master', 'Cao cấp', '2025-08-05'),
	('2ef4b03d-6435-4064-8bb4-c550150795cc', '2026-07-13 04:14:29.539557+00', 4, '2026-07-13 04:14:29.539557+00', 'active', 'Quốc tế', 'Chuyên gia', '2025-08-18'),
	('01cb981d-1c8a-4266-8e12-653519496038', '2026-07-13 04:15:32.265942+00', 4, '2026-07-13 04:15:32.265942+00', 'active', 'Quốc tế', 'Cao cấp', NULL),
	('00000000-0000-0000-0000-000000000002', '2026-07-12 06:27:32.780422+00', 2, '2026-07-12 06:27:32.780422+00', 'active', '', '', NULL),
	('7028271c-8032-4683-8ee5-44aa3134412d', '2026-07-13 10:06:53.822182+00', 3, '2026-07-13 10:06:53.822182+00', 'active', NULL, NULL, NULL);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sessions" ("id", "created_at", "name", "start_time", "end_time", "updated_at") OVERRIDING SYSTEM VALUE VALUES
	(1, '2026-07-05 03:45:41.329608+00', 'SA T2-T6', '08:00:00', '15:00:00', '2026-07-05 03:45:41.329608+00'),
	(2, '2026-07-05 03:46:10.953877+00', 'CH T2-T6', '10:00:00', '17:00:00', '2026-07-05 03:46:10.953877+00'),
	(3, '2026-07-05 03:46:36.105021+00', 'SA T7', '09:00:00', '16:00:00', '2026-07-05 03:46:36.105021+00'),
	(4, '2026-07-05 03:46:56.935026+00', 'CH T7', '11:00:00', '18:00:00', '2026-07-05 03:46:56.935026+00');


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."schedules" ("id", "created_at", "session_id", "employee_id", "date", "updated_at", "status") VALUES
	('a71d10c9-13f0-4085-82b4-75687ed72bfe', '2026-07-13 10:50:00.378298+00', 1, 'a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', '2026-07-14', '2026-07-13 10:50:00.378298+00', 'assigned'),
	('a4806656-03a8-47e6-bd58-d784dd946e0c', '2026-07-13 10:50:14.950689+00', 1, '065811f5-f030-4352-905f-49d1a869150f', '2026-07-14', '2026-07-13 10:50:14.950689+00', 'assigned'),
	('5124973e-f6cb-4eaf-a935-09fdac163586', '2026-07-13 10:50:24.521308+00', 1, 'dbf7fadf-a4f6-47ee-bacd-3128c5c62859', '2026-07-14', '2026-07-13 10:50:24.521308+00', 'assigned'),
	('cbfd68cc-3449-4f2a-955f-5ae2029011e3', '2026-07-13 10:50:56.524108+00', 2, '7732a3e1-e0cd-433c-bc0d-e406a156c231', '2026-07-14', '2026-07-13 10:50:56.524108+00', 'assigned'),
	('d814e9a1-445a-470d-89d5-ce636bcdc094', '2026-07-13 10:51:13.577351+00', 2, 'c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', '2026-07-14', '2026-07-13 10:51:13.577351+00', 'assigned'),
	('df45be79-554b-4fb3-a8f5-7506f481e00b', '2026-07-13 10:51:25.607095+00', 2, 'a1170ea5-18db-4f8e-bd80-68b55780d483', '2026-07-14', '2026-07-13 10:51:25.607095+00', 'assigned'),
	('d7576589-08e4-48dd-b038-a5fb5b8d817e', '2026-07-13 10:51:45.584624+00', 1, '9684ab27-9c41-4a71-a2a2-cd82900da161', '2026-07-15', '2026-07-13 10:51:45.584624+00', 'assigned'),
	('8605d915-98f3-4010-8f8e-5a9bd6f0b432', '2026-07-13 10:52:05.937072+00', 2, '1a0fb49f-2137-469a-a3d3-443510e83b21', '2026-07-15', '2026-07-13 10:52:05.937072+00', 'assigned'),
	('dbd801ac-e854-48af-92aa-962d2c8de756', '2026-07-13 10:52:21.646364+00', 1, '2ef4b03d-6435-4064-8bb4-c550150795cc', '2026-07-15', '2026-07-13 10:52:21.646364+00', 'assigned'),
	('cb49eef4-8297-497e-b6ad-64a60832ee43', '2026-07-13 10:52:35.405996+00', 2, '01cb981d-1c8a-4266-8e12-653519496038', '2026-07-15', '2026-07-13 10:52:35.405996+00', 'assigned'),
	('4078b2a9-e710-477f-bda4-e2f4fdc71891', '2026-07-13 10:52:48.825895+00', 1, 'bf97031d-96ba-4ce1-a0a2-8332866774a1', '2026-07-15', '2026-07-13 10:52:48.825895+00', 'assigned'),
	('dea362db-939d-4743-a132-c7663ccb40d4', '2026-07-13 10:53:02.749976+00', 2, 'c0437b96-ef92-44e1-a34a-233fc0f4eb58', '2026-07-15', '2026-07-13 10:53:02.749976+00', 'assigned');


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."appointments" ("schedule_id", "customer_id", "appointment_date", "status", "id", "created_at", "updated_at") VALUES
	('a71d10c9-13f0-4085-82b4-75687ed72bfe', 'fa223def-ae4a-4bcc-990d-2b6d5b781a41', '2026-07-14 08:00:00', 'completed', '2362b662-810d-4785-ac97-296ba092b736', '2026-07-13 10:53:24.048579+00', '2026-07-13 10:53:24.048579+00');


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."promotions" ("id", "name", "code", "discount_type", "discount_value", "min_order_value", "is_first_time", "day_of_week", "start_date", "end_date", "created_at", "updated_at", "is_active") VALUES
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 'Khách hàng đầu tiên', 'F1RST', 'percentage', 10, NULL, true, NULL, '2026-07-01 00:00:00', '2030-07-01 00:00:00', '2026-07-13 10:56:04.450376+00', '2026-07-13 10:56:04.450376+00', true),
	('53d0bfed-16b9-432a-9439-9d98e3a1d9d7', 'Thứ 2 hàng tuần', 'THUHAI-JR', 'percentage', 30, NULL, false, 1, '2025-04-30 00:00:00', '2030-09-02 00:00:00', '2026-07-13 08:03:29.05869+00', '2026-07-13 08:03:29.05869+00', true);


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bills" ("id", "appointment_id", "promotion_id", "total_price", "discount_amount", "created_at", "updated_at", "status") VALUES
	('7a32f374-81f2-41f7-a7a1-36763dad237f', '2362b662-810d-4785-ac97-296ba092b736', 'f93a4733-add7-45af-a28c-26c5b0f79ede', 580500, 64500, '2026-07-13 10:56:27.917989+00', '2026-07-13 10:56:27.917989+00', 'paid');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "created_at", "name", "image_url", "updated_at", "description", "status") OVERRIDING SYSTEM VALUE VALUES
	(1, '2026-07-02 12:58:06+00', 'HAIR', NULL, '2026-07-02 12:58:12+00', NULL, NULL),
	(2, '2026-07-02 12:58:21+00', 'NAIL', NULL, '2026-07-02 12:58:23+00', NULL, NULL),
	(3, '2026-07-02 12:58:32+00', 'SPA', NULL, '2026-07-02 12:58:35+00', NULL, NULL);


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."services" ("id", "created_at", "name", "category_id", "description", "price", "duration", "status", "updated_at") OVERRIDING SYSTEM VALUE VALUES
	(11, '2026-07-02 15:41:51.756251+00', 'LILY', 1, 'suôn mềm, tinh khôi', 645000, NULL, 'active', '2026-07-02 15:41:51.756251+00'),
	(12, '2026-07-02 15:42:30.71055+00', 'ROSE', 1, 'quyến rũ, nổi bật', 875000, NULL, 'active', '2026-07-02 15:42:30.71055+00'),
	(13, '2026-07-02 15:43:01.287302+00', 'TULIP', 1, 'đẳng cấp, chuyên sâu', 1575000, NULL, 'active', '2026-07-02 15:43:01.287302+00'),
	(14, '2026-07-02 15:43:23.874437+00', 'PEONY', 2, 'kiêu sa, lộng lẫy', 995000, NULL, 'active', '2026-07-02 15:43:23.874437+00'),
	(15, '2026-07-02 15:43:55.185817+00', 'SAKURA', 2, 'rực rỡ, dịu dàng', 875000, NULL, 'active', '2026-07-02 15:43:55.185817+00'),
	(16, '2026-07-02 15:44:24.323728+00', 'LAVENDER', 2, 'hoàn mỹ, bền lâu', 425000, NULL, 'active', '2026-07-02 15:44:24.323728+00'),
	(17, '2026-07-02 15:44:52.941171+00', 'SUNFLOWER', 2, 'kiên định, chân thành', 295000, NULL, 'active', '2026-07-02 15:44:52.941171+00'),
	(18, '2026-07-02 15:45:22.735666+00', 'JASMINE', 3, 'tươi trẻ, làm sạch', 645000, NULL, 'active', '2026-07-02 15:45:22.735666+00'),
	(19, '2026-07-02 15:45:51.480971+00', 'LOTUS', 3, 'premium, tận hưởng', 1245000, NULL, 'active', '2026-07-02 15:45:51.480971+00'),
	(20, '2026-07-02 15:46:21.561279+00', 'DAISY', 3, 'thư giãn, chữa lành', 745000, NULL, 'active', '2026-07-02 15:46:21.561279+00'),
	(23, '2026-07-03 16:01:27.461107+00', 'HIHI', 2, NULL, 540000, NULL, 'active', '2026-07-03 16:01:27.461107+00'),
	(22, '2026-07-03 16:00:55.973515+00', 'SUSU', 3, NULL, 200000, NULL, 'active', '2026-07-03 16:00:55.973515+00'),
	(25, '2026-07-03 16:06:22.030105+00', 'MOMO', 1, NULL, 900000, NULL, 'active', '2026-07-03 16:06:22.030105+00'),
	(26, '2026-07-13 04:19:30.974168+00', 'HAHA', 2, NULL, 500000, NULL, 'active', '2026-07-13 04:19:30.974168+00'),
	(21, '2026-07-03 16:00:27.750685+00', 'LALA', 1, NULL, 132000, NULL, 'active', '2026-07-03 16:00:27.750685+00');


--
-- Data for Name: bill_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bill_services" ("bill_id", "service_id", "quantity", "price_at_time", "id", "created_at", "updated_at") VALUES
	('7a32f374-81f2-41f7-a7a1-36763dad237f', 11, 1, 645000, 'eea15e50-c452-4f08-88b7-eb5190c48931', '2026-07-13 10:56:27.933787+00', '2026-07-13 10:56:27.933787+00');


--
-- Data for Name: details; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."details" ("id", "appointment_id", "service_id", "price", "description", "created_at", "updated_at") VALUES
	('d2642389-70d6-49d6-bcf5-41a8ffa55d9a', '2362b662-810d-4785-ac97-296ba092b736', 11, 645000, NULL, '2026-07-13 10:53:24.060436+00', '2026-07-13 10:53:24.060436+00');


--
-- Data for Name: employee_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employee_categories" ("category_id", "employee_id", "id", "created_at", "updated_at") VALUES
	(2, '065811f5-f030-4352-905f-49d1a869150f', '4c4b56ef-d8ba-4d8a-be26-1f3fbef69c02', '2026-07-12 12:22:26.61545+00', '2026-07-12 12:22:26.61545+00'),
	(2, '4b78548b-58c7-4c27-84db-7ee20aab4b88', 'bd58f957-3373-4b43-8fb7-f8cf33933e3e', '2026-07-12 12:22:43.61159+00', '2026-07-12 12:22:43.61159+00'),
	(1, 'a2dccfcf-3eb1-46bd-b904-102b3f6d0f72', '63739661-a96b-47e9-92f2-289cceb17306', '2026-07-12 12:22:54.866666+00', '2026-07-12 12:22:54.866666+00'),
	(2, 'c6ac5976-6b1c-4cee-ad0c-72c01e8ee763', '2e82c1c2-627a-4876-9227-e02bfb353648', '2026-07-12 12:30:02.749642+00', '2026-07-12 12:30:02.749642+00'),
	(3, 'c0437b96-ef92-44e1-a34a-233fc0f4eb58', 'dbd1853e-08b1-4736-8912-ee399b084f4c', '2026-07-12 12:30:15.681956+00', '2026-07-12 12:30:15.681956+00'),
	(1, '7732a3e1-e0cd-433c-bc0d-e406a156c231', '31852719-74fd-4804-8206-eb7b6f1bfd95', '2026-07-12 12:30:25.777761+00', '2026-07-12 12:30:25.777761+00'),
	(3, 'dbf7fadf-a4f6-47ee-bacd-3128c5c62859', '4c5d0d3a-87fa-45a1-893e-d572b699d070', '2026-07-13 04:05:08.416501+00', '2026-07-13 04:05:08.416501+00'),
	(3, 'a1170ea5-18db-4f8e-bd80-68b55780d483', '4fc24115-dfea-4ec0-a572-fd3fc2b7a19c', '2026-07-13 04:05:22.387927+00', '2026-07-13 04:05:22.387927+00'),
	(1, '9684ab27-9c41-4a71-a2a2-cd82900da161', 'b035d323-38b5-49b2-be75-57f71def88f3', '2026-07-13 04:06:00.425962+00', '2026-07-13 04:06:00.425962+00'),
	(1, '1a0fb49f-2137-469a-a3d3-443510e83b21', 'cebcc111-c76c-4d21-8f0e-e12f5d30b151', '2026-07-13 04:06:30.767165+00', '2026-07-13 04:06:30.767165+00'),
	(3, 'bf97031d-96ba-4ce1-a0a2-8332866774a1', '6754317f-e389-469e-a772-34dd0876721a', '2026-07-13 04:12:30.500046+00', '2026-07-13 04:12:30.500046+00'),
	(2, 'cc6cb3e0-ef51-4b7c-9613-a19876ece007', 'e8377b73-54f7-473a-82f1-4f4a72bd2f32', '2026-07-13 04:12:50.50708+00', '2026-07-13 04:12:50.50708+00'),
	(2, '2ef4b03d-6435-4064-8bb4-c550150795cc', 'da4e7c61-da92-4fbb-a802-f819a4ae62f7', '2026-07-13 04:16:25.266597+00', '2026-07-13 04:16:25.266597+00'),
	(2, '01cb981d-1c8a-4266-8e12-653519496038', '5dc0d642-f99e-43df-89f6-0fbf6fc318c3', '2026-07-13 04:16:45.424495+00', '2026-07-13 04:16:45.424495+00');


--
-- Data for Name: promotion_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."promotion_services" ("promotion_id", "service_id", "created_at", "updated_at") VALUES
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 19, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 20, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 18, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 16, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 15, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 14, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 17, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 13, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 12, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('f93a4733-add7-45af-a28c-26c5b0f79ede', 11, '2026-07-13 10:56:04.489781+00', '2026-07-13 10:56:04.489781+00'),
	('53d0bfed-16b9-432a-9439-9d98e3a1d9d7', 13, '2026-07-13 11:42:38.92608+00', '2026-07-13 11:42:38.92608+00'),
	('53d0bfed-16b9-432a-9439-9d98e3a1d9d7', 12, '2026-07-13 11:42:38.92608+00', '2026-07-13 11:42:38.92608+00'),
	('53d0bfed-16b9-432a-9439-9d98e3a1d9d7', 11, '2026-07-13 11:42:38.92608+00', '2026-07-13 11:42:38.92608+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('avatars', 'avatars', NULL, '2026-07-02 12:44:36.848871+00', '2026-07-02 12:44:36.848871+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('b41f6923-91fb-4eae-9c0d-1bbe25d21aca', 'avatars', 'ea6cda8d-a2a1-4099-b5a3-7c8836efd104_1782996301099.png', 'ea6cda8d-a2a1-4099-b5a3-7c8836efd104', '2026-07-02 12:45:01.990929+00', '2026-07-02 12:45:01.990929+00', '2026-07-02 12:45:01.990929+00', '{"eTag": "\"2b8607485555dfddac0cb04da411712c\"", "size": 224978, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T12:45:01.927Z", "contentLength": 224978, "httpStatusCode": 200}', 'd52d540a-0983-4960-bb41-9fbd01a65f1b', 'ea6cda8d-a2a1-4099-b5a3-7c8836efd104', '{}'),
	('b9166fca-492e-4e4a-9f5e-9f41bce73a76', 'avatars', '25120500-082b-4197-83c8-857cd2f1b350_1782996927063.png', '25120500-082b-4197-83c8-857cd2f1b350', '2026-07-02 12:55:27.81074+00', '2026-07-02 12:55:27.81074+00', '2026-07-02 12:55:27.81074+00', '{"eTag": "\"830982dd87cdf6ba563ae3a85a73e446\"", "size": 363201, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T12:55:27.782Z", "contentLength": 363201, "httpStatusCode": 200}', 'ded57847-11c0-4187-868a-7d64f2bc9390', '25120500-082b-4197-83c8-857cd2f1b350', '{}'),
	('9bafb4e6-7c67-4703-8bc6-6849425a69f6', 'avatars', '25120500-082b-4197-83c8-857cd2f1b350_1782996944925.png', '25120500-082b-4197-83c8-857cd2f1b350', '2026-07-02 12:55:45.04476+00', '2026-07-02 12:55:45.04476+00', '2026-07-02 12:55:45.04476+00', '{"eTag": "\"2c670ae53ff8eb21cf58dc087923b784\"", "size": 341440, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T12:55:45.031Z", "contentLength": 341440, "httpStatusCode": 200}', '7de290be-8260-4354-ac06-44d3369fcf70', '25120500-082b-4197-83c8-857cd2f1b350', '{}'),
	('4cd09d6b-52b3-4080-b64b-d1438991f7ba', 'avatars', '0d10bbac-3c77-4c70-8e5e-46c778ef9925-1783850432865.PNG', NULL, '2026-07-12 10:00:33.49423+00', '2026-07-12 10:00:33.49423+00', '2026-07-12 10:00:33.49423+00', '{"eTag": "\"c032f4db8439af56a79a5ad5f738b810\"", "size": 502390, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T10:00:33.464Z", "contentLength": 502390, "httpStatusCode": 200}', '699482c4-9e73-480d-b134-617deb4753ae', NULL, '{}'),
	('ffb45ee5-8f87-43a8-94dd-6d344d48ba9d', 'avatars', 'c38e20a1-30ed-4175-b5a0-e0b887185205-1783850557951.PNG', NULL, '2026-07-12 10:02:38.036861+00', '2026-07-12 10:02:38.036861+00', '2026-07-12 10:02:38.036861+00', '{"eTag": "\"9a2449f0444998307b03cf592c0ee387\"", "size": 522138, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T10:02:38.027Z", "contentLength": 522138, "httpStatusCode": 200}', '3df860c8-6daa-468e-b869-f184d853e25f', NULL, '{}'),
	('16a95254-b1f3-4b22-a438-7d2d9dca107b', 'avatars', 'fbac3ce7-848b-473b-9734-e43fe700d97c-1783850615177.PNG', NULL, '2026-07-12 10:03:35.260523+00', '2026-07-12 10:03:35.260523+00', '2026-07-12 10:03:35.260523+00', '{"eTag": "\"6ec147dbe072ba5e0bdb090ec166e71d\"", "size": 459997, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T10:03:35.249Z", "contentLength": 459997, "httpStatusCode": 200}', 'cfb36f9c-149b-4d04-b124-27223a1922cd', NULL, '{}'),
	('a45aa92e-7be9-4925-8cfd-7ac8a0867534', 'avatars', 'fe9798da-502a-49c6-bc6b-317237d320c5-1783850694059.PNG', NULL, '2026-07-12 10:04:54.137848+00', '2026-07-12 10:04:54.137848+00', '2026-07-12 10:04:54.137848+00', '{"eTag": "\"b1dfdca8d284a8b368c37209960fcec4\"", "size": 411234, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T10:04:54.128Z", "contentLength": 411234, "httpStatusCode": 200}', '7d34a088-a143-4c1b-8337-40f0ce57b4bd', NULL, '{}'),
	('22a82fca-e2af-44a8-911c-78eac0dcaaf7', 'avatars', 'f1d819b2-5901-4039-95e5-0e167c6e9d3c-1783850756656.PNG', NULL, '2026-07-12 10:05:56.781556+00', '2026-07-12 10:05:56.781556+00', '2026-07-12 10:05:56.781556+00', '{"eTag": "\"b5a233f5016f1c286d6d80595aac749f\"", "size": 588357, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T10:05:56.768Z", "contentLength": 588357, "httpStatusCode": 200}', '1ee8b9ca-98ae-4988-88be-ca29b2368dc1', NULL, '{}'),
	('c7781318-ecc1-4621-b373-4d3fa520a918', 'avatars', 'a2dccfcf-3eb1-46bd-b904-102b3f6d0f72-1783855481413.JPG', NULL, '2026-07-12 11:24:42.625004+00', '2026-07-12 11:24:42.625004+00', '2026-07-12 11:24:42.625004+00', '{"eTag": "\"d406429941a2aa4fa741b5cb4a464d66\"", "size": 301737, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T11:24:42.572Z", "contentLength": 301737, "httpStatusCode": 200}', 'b6fdbaad-aa84-453b-9652-4e52a8994ba1', NULL, '{}'),
	('f4289dad-a5a6-4536-a6d6-3a914884a6b7', 'avatars', '065811f5-f030-4352-905f-49d1a869150f-1783855592159.PNG', NULL, '2026-07-12 11:26:32.250044+00', '2026-07-12 11:26:32.250044+00', '2026-07-12 11:26:32.250044+00', '{"eTag": "\"be90870d1deb4073cb3c79a50a45fcf9\"", "size": 380414, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T11:26:32.239Z", "contentLength": 380414, "httpStatusCode": 200}', '6c113a52-03d0-42c1-b7df-2a641fd9e8fa', NULL, '{}'),
	('5506e777-996d-4595-b9b2-c97865c36a68', 'avatars', 'bab2d2c1-852d-4956-a777-9942a2201a80-1783858352496.jpg', NULL, '2026-07-12 12:12:32.773753+00', '2026-07-12 12:12:32.773753+00', '2026-07-12 12:12:32.773753+00', '{"eTag": "\"e891d923888418b2f7748b0a9c1446a1\"", "size": 91222, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:12:32.737Z", "contentLength": 91222, "httpStatusCode": 200}', '2c27ea64-dca0-48e8-98d0-2aa3f9aad136', NULL, '{}'),
	('37fb4629-78d1-4cf2-b4ab-eb02738f015f', 'avatars', 'bab2d2c1-852d-4956-a777-9942a2201a80-1783858418178.JPG', NULL, '2026-07-12 12:13:38.286019+00', '2026-07-12 12:13:38.286019+00', '2026-07-12 12:13:38.286019+00', '{"eTag": "\"6f28c5ba8bde506aa2a17950a98156cb\"", "size": 198462, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:13:38.272Z", "contentLength": 198462, "httpStatusCode": 200}', 'b18b0187-c158-4e56-b5a0-4ca6869b83d9', NULL, '{}'),
	('5a13d5df-102d-49ff-9cfe-945c10283507', 'avatars', 'a5b11d0c-7496-443b-b7ee-02f3279aa4b3-1783858605605.PNG', NULL, '2026-07-12 12:16:45.707828+00', '2026-07-12 12:16:45.707828+00', '2026-07-12 12:16:45.707828+00', '{"eTag": "\"b56b85dfd5fc89c9b5c01c7aaa0add62\"", "size": 290240, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:16:45.695Z", "contentLength": 290240, "httpStatusCode": 200}', '4ff3189d-82d0-417f-a290-f86840cb88b6', NULL, '{}'),
	('afd00511-fa13-4d84-87ab-0a77a01aba4f', 'avatars', '8c423376-b3a9-4cc5-ae81-db8e80e8cda1-1783858764198.JPG', NULL, '2026-07-12 12:19:24.281613+00', '2026-07-12 12:19:24.281613+00', '2026-07-12 12:19:24.281613+00', '{"eTag": "\"a346cb51485e38352e17247180345ca2\"", "size": 330914, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:19:24.271Z", "contentLength": 330914, "httpStatusCode": 200}', 'c844cebf-99fb-4609-b1b7-4a6b99c62ca5', NULL, '{}'),
	('1dc6cfce-91b5-4696-80c6-27dce04d0ad3', 'avatars', '4b78548b-58c7-4c27-84db-7ee20aab4b88-1783858860506.PNG', NULL, '2026-07-12 12:21:00.620934+00', '2026-07-12 12:21:00.620934+00', '2026-07-12 12:21:00.620934+00', '{"eTag": "\"a4f44ef2cfa583d1e1febf88b46fc277\"", "size": 172141, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:21:00.614Z", "contentLength": 172141, "httpStatusCode": 200}', '10071dc7-1db3-4469-aa44-549b95d61e65', NULL, '{}'),
	('e86a075a-ed42-4e3a-b06c-11ccb0b32049', 'avatars', 'c6ac5976-6b1c-4cee-ad0c-72c01e8ee763-1783859063347.JPG', NULL, '2026-07-12 12:24:23.530817+00', '2026-07-12 12:24:23.530817+00', '2026-07-12 12:24:23.530817+00', '{"eTag": "\"f8bd0e84ba7240974f34cf3ce7a012f0\"", "size": 380779, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:24:23.518Z", "contentLength": 380779, "httpStatusCode": 200}', 'fe275e5f-cdfc-4031-8fa1-f05dcaa81fdd', NULL, '{}'),
	('6be2c99f-dde8-494a-8814-5d3efd85063d', 'avatars', 'c0437b96-ef92-44e1-a34a-233fc0f4eb58-1783859239635.JPG', NULL, '2026-07-12 12:27:19.746921+00', '2026-07-12 12:27:19.746921+00', '2026-07-12 12:27:19.746921+00', '{"eTag": "\"e177db81e7a2bc075b239781cec54b0d\"", "size": 342967, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:27:19.734Z", "contentLength": 342967, "httpStatusCode": 200}', 'b411d701-6ec3-49e0-9411-b23b282489c2', NULL, '{}'),
	('54b1ec63-6ea8-4d59-9a5d-c8b109cfecfc', 'avatars', '7732a3e1-e0cd-433c-bc0d-e406a156c231-1783859361730.JPG', NULL, '2026-07-12 12:29:21.819672+00', '2026-07-12 12:29:21.819672+00', '2026-07-12 12:29:21.819672+00', '{"eTag": "\"4b90d4690ff05a74029ecde1ecae3b3f\"", "size": 351687, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T12:29:21.800Z", "contentLength": 351687, "httpStatusCode": 200}', '7aa8f486-267d-4202-9f14-350106f3dec5', NULL, '{}'),
	('9a41e112-a77b-496e-af0f-004837860ead', 'avatars', '00000000-0000-0000-0000-000000000001/avatar-1783866931564.jpg', '00000000-0000-0000-0000-000000000001', '2026-07-12 14:35:31.844542+00', '2026-07-12 14:35:31.844542+00', '2026-07-12 14:35:31.844542+00', '{"eTag": "\"e891d923888418b2f7748b0a9c1446a1\"", "size": 91222, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T14:35:31.828Z", "contentLength": 91222, "httpStatusCode": 200}', '62f90342-8986-403a-bfaf-28589b6c21c0', '00000000-0000-0000-0000-000000000001', '{}'),
	('f6f2e0e4-25b1-4995-a740-4bc9579f6037', 'avatars', '00000000-0000-0000-0000-000000000001/avatar-1783867077086.jpg', '00000000-0000-0000-0000-000000000001', '2026-07-12 14:37:57.73862+00', '2026-07-12 14:37:57.73862+00', '2026-07-12 14:37:57.73862+00', '{"eTag": "\"e891d923888418b2f7748b0a9c1446a1\"", "size": 91222, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-12T14:37:57.706Z", "contentLength": 91222, "httpStatusCode": 200}', '0ab676d6-78a8-4e4a-bb46-a553f92b9f02', '00000000-0000-0000-0000-000000000001', '{}'),
	('c017e066-e28d-4935-bb0b-e52335d0dd72', 'avatars', 'dbf7fadf-a4f6-47ee-bacd-3128c5c62859-1783915343811.JPG', NULL, '2026-07-13 04:02:24.557488+00', '2026-07-13 04:02:24.557488+00', '2026-07-13 04:02:24.557488+00', '{"eTag": "\"8defd27bcabf72078b506a9e97837942\"", "size": 488296, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:02:24.521Z", "contentLength": 488296, "httpStatusCode": 200}', 'edafe7cf-e209-4971-9860-6f1ff78759e4', NULL, '{}'),
	('12f1a4ca-8b34-409b-82aa-9129a5078d5b', 'avatars', 'a1170ea5-18db-4f8e-bd80-68b55780d483-1783915378210.JPG', NULL, '2026-07-13 04:02:58.25203+00', '2026-07-13 04:02:58.25203+00', '2026-07-13 04:02:58.25203+00', '{"eTag": "\"aa46b6fa59199ce6c6fe65094cb8e50f\"", "size": 169521, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:02:58.246Z", "contentLength": 169521, "httpStatusCode": 200}', '8a16fa76-cb7d-4f81-84e2-cb8962f3e7a6', NULL, '{}'),
	('c855cb84-a54a-457d-88ad-bafe7ac82ff4', 'avatars', '9684ab27-9c41-4a71-a2a2-cd82900da161-1783915430693.JPG', NULL, '2026-07-13 04:03:50.726004+00', '2026-07-13 04:03:50.726004+00', '2026-07-13 04:03:50.726004+00', '{"eTag": "\"93ec8e3aaf29feaf3df46b59cb726e61\"", "size": 137479, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:03:50.717Z", "contentLength": 137479, "httpStatusCode": 200}', 'cf1cfdb9-d0b9-401a-a4cd-e49e31c534ec', NULL, '{}'),
	('24e92268-0b22-46c5-984d-b2e1cccb1868', 'avatars', '1a0fb49f-2137-469a-a3d3-443510e83b21-1783915463289.JPG', NULL, '2026-07-13 04:04:23.321971+00', '2026-07-13 04:04:23.321971+00', '2026-07-13 04:04:23.321971+00', '{"eTag": "\"390bdcf5608be0048d7ca1e766bbcbe7\"", "size": 202138, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:04:23.314Z", "contentLength": 202138, "httpStatusCode": 200}', '66059261-a9c0-4357-82fa-68ca6b78069d', NULL, '{}'),
	('3242315b-9b2d-4a42-a96f-a22ce2b7c6a6', 'avatars', 'bf97031d-96ba-4ce1-a0a2-8332866774a1-1783915841083.JPG', NULL, '2026-07-13 04:10:41.207054+00', '2026-07-13 04:10:41.207054+00', '2026-07-13 04:10:41.207054+00', '{"eTag": "\"53948e62be8cff5a2397139407a095ff\"", "size": 373539, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:10:41.192Z", "contentLength": 373539, "httpStatusCode": 200}', '1209a608-4044-4699-b6bf-2fa1dc08fe7d', NULL, '{}'),
	('dc153b42-9fea-4aab-b3e9-9d3c9ec53b26', 'avatars', 'cc6cb3e0-ef51-4b7c-9613-a19876ece007-1783915915776.JPG', NULL, '2026-07-13 04:11:55.862263+00', '2026-07-13 04:11:55.862263+00', '2026-07-13 04:11:55.862263+00', '{"eTag": "\"63177f79b8540a9567fbb4122ab22d72\"", "size": 286103, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:11:55.856Z", "contentLength": 286103, "httpStatusCode": 200}', '87ec5eda-9cb5-4bd3-9428-933259a542f7', NULL, '{}'),
	('1c91b9e7-e824-44c0-94d5-ce06348aac2d', 'avatars', '2ef4b03d-6435-4064-8bb4-c550150795cc-1783916103265.PNG', NULL, '2026-07-13 04:15:03.365846+00', '2026-07-13 04:15:03.365846+00', '2026-07-13 04:15:03.365846+00', '{"eTag": "\"cbedf26660df015f5ea73092f22fccdb\"", "size": 387432, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:15:03.356Z", "contentLength": 387432, "httpStatusCode": 200}', '4916cb88-41e7-4ef2-9249-4fef4d3f9483', NULL, '{}'),
	('12ffd798-ffbf-41da-af48-da989a386b19', 'avatars', '01cb981d-1c8a-4266-8e12-653519496038-1783916162714.JPG', NULL, '2026-07-13 04:16:02.782452+00', '2026-07-13 04:16:02.782452+00', '2026-07-13 04:16:02.782452+00', '{"eTag": "\"4a75ac042de969ac55e651908c6acbdd\"", "size": 125878, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T04:16:02.774Z", "contentLength": 125878, "httpStatusCode": 200}', '969af519-034d-4a7d-bb58-d2c32179f0b8', NULL, '{}'),
	('e447a824-58ce-43fc-aa6a-68819668cf6a', 'avatars', '4fceb721-163a-4548-bad1-b14e3cd0dce7_1783926592123.png', '4fceb721-163a-4548-bad1-b14e3cd0dce7', '2026-07-13 07:09:52.448426+00', '2026-07-13 07:09:52.448426+00', '2026-07-13 07:09:52.448426+00', '{"eTag": "\"2b8607485555dfddac0cb04da411712c\"", "size": 224978, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T07:09:52.395Z", "contentLength": 224978, "httpStatusCode": 200}', 'e2ee7877-406e-421d-a125-0fd4a4e2cace', '4fceb721-163a-4548-bad1-b14e3cd0dce7', '{}'),
	('8baf47bf-8a98-477f-8684-19ff6b4add55', 'avatars', '1b69863f-48b3-4952-b5f6-727ac3fd24c2_1783926929285.png', '1b69863f-48b3-4952-b5f6-727ac3fd24c2', '2026-07-13 07:15:29.381331+00', '2026-07-13 07:15:29.381331+00', '2026-07-13 07:15:29.381331+00', '{"eTag": "\"2c670ae53ff8eb21cf58dc087923b784\"", "size": 341440, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T07:15:29.364Z", "contentLength": 341440, "httpStatusCode": 200}', '5186a28a-af36-4d4a-bb7c-1675237aebb0', '1b69863f-48b3-4952-b5f6-727ac3fd24c2', '{}'),
	('8d423af5-da81-4aa4-bbe1-e89e5c79c226', 'avatars', '1b69863f-48b3-4952-b5f6-727ac3fd24c2_1783933473847.png', '1b69863f-48b3-4952-b5f6-727ac3fd24c2', '2026-07-13 09:04:34.213395+00', '2026-07-13 09:04:34.213395+00', '2026-07-13 09:04:34.213395+00', '{"eTag": "\"b31f79fd24063f11e3b01f8d7e6d433b\"", "size": 52510, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T09:04:34.193Z", "contentLength": 52510, "httpStatusCode": 200}', '101efece-8f4a-4188-9f67-5a036c4a2d03', '1b69863f-48b3-4952-b5f6-727ac3fd24c2', '{}'),
	('7d5f9fcc-460e-49c9-a347-95d2bbf33bd6', 'avatars', '7028271c-8032-4683-8ee5-44aa3134412d-1783937227432.jpg', NULL, '2026-07-13 10:07:07.778597+00', '2026-07-13 10:07:07.778597+00', '2026-07-13 10:07:07.778597+00', '{"eTag": "\"830982dd87cdf6ba563ae3a85a73e446\"", "size": 363201, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T10:07:07.746Z", "contentLength": 363201, "httpStatusCode": 200}', 'd62fc73a-7a54-4f38-9074-f7d6ebea4d05', NULL, '{}'),
	('f07461c6-e9f1-4e0d-a58d-6ed0df6147a7', 'avatars', 'customers/fa223def-ae4a-4bcc-990d-2b6d5b781a41/avatar-1783942779909.jpg', NULL, '2026-07-13 11:39:40.175174+00', '2026-07-13 11:39:40.175174+00', '2026-07-13 11:39:40.175174+00', '{"eTag": "\"2b8607485555dfddac0cb04da411712c\"", "size": 224978, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-13T11:39:40.141Z", "contentLength": 224978, "httpStatusCode": 200}', 'ff162f49-20f4-4c49-8cee-e30f6dec3a77', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 104, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 3, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 5, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."services_id_seq"', 26, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."sessions_id_seq"', 7, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict AvkeHecO0NnuJ1is2qc89sMnTKKyN4CGOGaqCXf7aIzEsAas1Yj05FKvyOwbXqZ

RESET ALL;
