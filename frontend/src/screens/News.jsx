import React from "react";
import { useNavigate } from "react-router-dom";

const News = () => {
	const navigate = useNavigate();

	// map news sources to local assets (fall back safely)
	const assets = {
		"Times of India": (() => { try { return new URL("../assets/times of india.png", import.meta.url).href } catch (e) { return null } })(),
		NDTV: (() => { try { return new URL("../assets/ndtv.png", import.meta.url).href } catch (e) { return null } })(),
		"India Today": (() => { try { return new URL("../assets/India today.png", import.meta.url).href } catch (e) { return null } })(),
		"CNN-News18": (() => { try { return new URL("../assets/cnn.png", import.meta.url).href } catch (e) { return null } })(),
		"Republic TV": (() => { try { return new URL("../assets/republic.png", import.meta.url).href } catch (e) { return null } })(),
		"Zee News": (() => { try { return new URL("../assets/zee news.png", import.meta.url).href } catch (e) { return null } })(),
		"ABP News": (() => { try { return new URL("../assets/abp.jpeg", import.meta.url).href } catch (e) { return null } })(),
		"The Hindu": (() => { try { return new URL("../assets/the hindu.jpeg", import.meta.url).href } catch (e) { return null } })(),
		"BBC News India": (() => { try { return new URL("../assets/BBC NEWS.png", import.meta.url).href } catch (e) { return null } })(),
		"Aaj Tak": (() => { try { return new URL("../assets/Aaj tak.jpeg", import.meta.url).href } catch (e) { return null } })(),
	};

	const newsItems = [
		{ id: 1, title: "Times of India", url: "https://timesofindia.indiatimes.com" },
		{ id: 2, title: "NDTV", url: "https://www.ndtv.com" },
		{ id: 3, title: "India Today", url: "https://www.indiatoday.in" },
		{ id: 4, title: "CNN-News18", url: "https://www.news18.com" },
		{ id: 5, title: "Republic TV", url: "https://www.republicworld.com" },
		{ id: 6, title: "Zee News", url: "https://zeenews.india.com" },
		{ id: 7, title: "ABP News", url: "https://www.abplive.com" },
		{ id: 8, title: "The Hindu", url: "https://www.thehindu.com" },
		{ id: 9, title: "BBC News India", url: "https://www.bbc.com/news/world/asia/india" },
		{ id: 10, title: "Aaj Tak", url: "https://www.aajtak.in" },
	];

	return (
		<main className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-extrabold text-gray-800">Live News</h1>
					<button onClick={() => navigate(-1)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
						← Back
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{newsItems.map((item) => (
						<article key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition overflow-hidden">
							<div className="h-48 sm:h-56 bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden">
											{assets[item.title] ? (
												<img src={assets[item.title]} alt={`${item.title} logo`} className="w-full h-full object-contain p-4 bg-white" />
											) : (
												<div className="w-full h-full" />
											)}
										</div>

							<div className="p-4 flex flex-col gap-3">
								<h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
								<p className="text-sm text-gray-500">Open the official news source in a new tab.</p>
								<div className="mt-2 flex items-center justify-between">
									<span className="text-xs text-gray-400">Trusted</span>
									{item.url ? (
										<a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:opacity-95">
											Open ↗
										</a>
									) : (
										<button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-full">Open</button>
									)}
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</main>
	);
};

export default News;
