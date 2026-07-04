SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict esfgmFI0WcAPEBkCXNWPEdpe1UjMGBw5gDnr6qDpiehJGMcfGlyrqna0uLEJJrZ

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
	('00000000-0000-0000-0000-000000000000', 'ad0b9686-7f9a-4448-9d66-5c29f34833a2', '{"action":"logout","actor_id":"84c15dff-946b-496c-b649-99303efbd59e","actor_username":"tin@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-04 10:24:18.548593+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '24c9b2a0-9b9b-4c00-93ab-a223013102fa', 'authenticated', 'authenticated', 'lanshen@gmail.com', '$2a$10$2vK4Kg6ih1vyX2RlPKzzPOoTjjiGHwqiJwIFaDtmBSRa4atAwjzd.', '2026-07-04 10:16:25.763956+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"full_name": "Đường Lam Thần", "email_verified": true}', NULL, '2026-07-04 10:16:25.753541+00', '2026-07-04 10:16:25.765801+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '84c15dff-946b-496c-b649-99303efbd59e', 'authenticated', 'authenticated', 'tin@gmail.com', '$2a$10$0olnhP.9ABs2AttBN.BsSee9148mLXUTMGvo0cQV42TPWqLByk7ry', '2026-07-04 10:23:22.423314+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-04 10:23:22.449705+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "84c15dff-946b-496c-b649-99303efbd59e", "email": "tin@gmail.com", "fullName": "Martin", "fullname": "Martin", "email_verified": true, "phone_verified": false}', NULL, '2026-07-04 10:23:22.376558+00', '2026-07-04 10:24:11.869593+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('24c9b2a0-9b9b-4c00-93ab-a223013102fa', '24c9b2a0-9b9b-4c00-93ab-a223013102fa', '{"sub": "24c9b2a0-9b9b-4c00-93ab-a223013102fa", "email": "lanshen@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-04 10:16:25.757955+00', '2026-07-04 10:16:25.757995+00', '2026-07-04 10:16:25.757995+00', '44a743b1-d32d-4db9-8c77-c6713a8cda34'),
	('84c15dff-946b-496c-b649-99303efbd59e', '84c15dff-946b-496c-b649-99303efbd59e', '{"sub": "84c15dff-946b-496c-b649-99303efbd59e", "email": "tin@gmail.com", "fullname": "Matin", "email_verified": false, "phone_verified": false}', 'email', '2026-07-04 10:23:22.409803+00', '2026-07-04 10:23:22.409857+00', '2026-07-04 10:23:22.409857+00', '0305ffc0-7817-4b0d-8ba6-14921d21006e');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



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
	('24c9b2a0-9b9b-4c00-93ab-a223013102fa', '2026-07-04 10:16:25.752181+00', NULL, 'female', NULL, '0906336643', NULL, 'lanshen@gmail.com', '2026-07-04 10:16:25.752181+00', 'Đường Lam Thần'),
	('84c15dff-946b-496c-b649-99303efbd59e', '2026-07-04 10:23:22.370864+00', NULL, NULL, NULL, NULL, NULL, 'tin@gmail.com', '2026-07-04 10:24:11.653+00', 'Martin');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "created_at", "status", "updated_at") VALUES
	('84c15dff-946b-496c-b649-99303efbd59e', '2026-07-04 10:23:22.370864+00', 'active', '2026-07-04 10:23:22.370864+00');


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

INSERT INTO "public"."employees" ("id", "created_at", "role_id", "updated_at", "status") VALUES
	('24c9b2a0-9b9b-4c00-93ab-a223013102fa', '2026-07-04 10:16:26.261244+00', 3, '2026-07-04 10:16:26.261244+00', 'active');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
	(11, '2026-07-02 15:41:51.756251+00', 'LILY', 1, 'suôn mềm, tinh khôi', 645000, NULL, NULL, '2026-07-02 15:41:51.756251+00'),
	(12, '2026-07-02 15:42:30.71055+00', 'ROSE', 1, 'quyến rũ, nổi bật', 875000, NULL, NULL, '2026-07-02 15:42:30.71055+00'),
	(13, '2026-07-02 15:43:01.287302+00', 'TULIP', 1, 'đẳng cấp, chuyên sâu', 1575000, NULL, NULL, '2026-07-02 15:43:01.287302+00'),
	(14, '2026-07-02 15:43:23.874437+00', 'PEONY', 2, 'kiêu sa, lộng lẫy', 995000, NULL, NULL, '2026-07-02 15:43:23.874437+00'),
	(15, '2026-07-02 15:43:55.185817+00', 'SAKURA', 2, 'rực rỡ, dịu dàng', 875000, NULL, NULL, '2026-07-02 15:43:55.185817+00'),
	(16, '2026-07-02 15:44:24.323728+00', 'LAVENDER', 2, 'hoàn mỹ, bền lâu', 425000, NULL, NULL, '2026-07-02 15:44:24.323728+00'),
	(17, '2026-07-02 15:44:52.941171+00', 'SUNFLOWER', 2, 'kiên định, chân thành', 295000, NULL, NULL, '2026-07-02 15:44:52.941171+00'),
	(18, '2026-07-02 15:45:22.735666+00', 'JASMINE', 3, 'tươi trẻ, làm sạch', 645000, NULL, NULL, '2026-07-02 15:45:22.735666+00'),
	(19, '2026-07-02 15:45:51.480971+00', 'LOTUS', 3, 'premium, tận hưởng', 1245000, NULL, NULL, '2026-07-02 15:45:51.480971+00'),
	(20, '2026-07-02 15:46:21.561279+00', 'DAISY', 3, 'thư giãn, chữa lành', 745000, NULL, NULL, '2026-07-02 15:46:21.561279+00'),
	(23, '2026-07-03 16:01:27.461107+00', 'HIHI', 2, NULL, 540000, NULL, NULL, '2026-07-03 16:01:27.461107+00'),
	(21, '2026-07-03 16:00:27.750685+00', 'LALA', 1, NULL, 132000, NULL, NULL, '2026-07-03 16:00:27.750685+00'),
	(22, '2026-07-03 16:00:55.973515+00', 'SUSU', 3, NULL, 200000, NULL, NULL, '2026-07-03 16:00:55.973515+00'),
	(25, '2026-07-03 16:06:22.030105+00', 'MOMO', 1, NULL, 900000, NULL, NULL, '2026-07-03 16:06:22.030105+00');


--
-- Data for Name: bill_services; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employee_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promotion_services; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
	('9bafb4e6-7c67-4703-8bc6-6849425a69f6', 'avatars', '25120500-082b-4197-83c8-857cd2f1b350_1782996944925.png', '25120500-082b-4197-83c8-857cd2f1b350', '2026-07-02 12:55:45.04476+00', '2026-07-02 12:55:45.04476+00', '2026-07-02 12:55:45.04476+00', '{"eTag": "\"2c670ae53ff8eb21cf58dc087923b784\"", "size": 341440, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T12:55:45.031Z", "contentLength": 341440, "httpStatusCode": 200}', '7de290be-8260-4354-ac06-44d3369fcf70', '25120500-082b-4197-83c8-857cd2f1b350', '{}');


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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 15, true);


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

SELECT pg_catalog.setval('"public"."services_id_seq"', 25, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."sessions_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict esfgmFI0WcAPEBkCXNWPEdpe1UjMGBw5gDnr6qDpiehJGMcfGlyrqna0uLEJJrZ

RESET ALL;
