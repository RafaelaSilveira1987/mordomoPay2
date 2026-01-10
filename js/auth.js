// Configuração do Supabase
130	const SUPABASE_URL = 'https://fetimotrijqyswrfoyzz.supabase.co';
131	const SUPABASE_KEY = 'SUA_CHAVE_ANON_AQUI'; 
132	
133	const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
134	
135	const Auth = {
136	    async login(phone, password) {
137	        const { data, error } = await supabaseClient
138	            .from('usuarios')
139	            .select('*')
140	            .eq('celular', phone)
141	            .eq('senha', password)
142	            .single();
143	
144	        if (error || !data) {
145	            throw new Error('Celular ou senha incorretos.');
146	        }
147	
148	        localStorage.setItem('mordomopay_user', JSON.stringify(data));
149	        return data;
150	    },
151	
152	    logout() {
153	        localStorage.removeItem('mordomopay_user');
154	        window.location.href = 'login.html';
155	    },
156	
157	    async getUser() {
158	        const localUser = localStorage.getItem('mordomopay_user');
159	        if (localUser) return JSON.parse(localUser);
160	        return null;
161	    },
162	
163	    checkAuth() {
164	        const user = localStorage.getItem('mordomopay_user');
165	        if (!user && !window.location.pathname.includes('login.html')) {
166	            window.location.href = 'login.html';
167	        }
168	    }
169	};
170	
171	document.addEventListener('DOMContentLoaded', async () => {
172	    const user = await Auth.getUser();
173	    if (user) {
174	        const userDisplays = document.querySelectorAll('.user-name');
175	        userDisplays.forEach(el => el.textContent = user.nome || 'Usuário');
176	        
177	        const userAvatars = document.querySelectorAll('.user-avatar');
178	        userAvatars.forEach(el => el.textContent = (user.nome || 'U').charAt(0).toUpperCase());
179	    }
180	
181	    const menuToggle = document.getElementById('menu-toggle');
182	    const sidebar = document.getElementById('sidebar');
183	    if (menuToggle && sidebar) {
184	        menuToggle.addEventListener('click', () => {
185	            sidebar.classList.toggle('active');
186	        });
187	    }
188	});
189	
