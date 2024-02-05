import { useEffect, useState } from "react";
import { useViewStore } from "~components/MainFrameContainer";
import { usePageElementStore } from "~components/Template/Template";
import { Views } from "~types";
import HoverCanvas from "./HoverCanvas";

function HoverSelector() {
	const { changeView } = useViewStore();
	const { setCurrentPageElement } = usePageElementStore();

	const [hoveredElement, setHoveredElement] = useState<HTMLElement>();

	const selectElement = async (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		const el = e.target as HTMLElement;
		console.log("selecteddd", el);

		setCurrentPageElement({
			element: el,
		});

		changeView(Views.Selection.Detail);
	};

	const addHoverEffect = (e: MouseEvent) => {
		const el = e.target as HTMLElement;
		setHoveredElement(el);
	};

	useEffect(() => {
		document.addEventListener("mouseover", addHoverEffect);
		document.addEventListener("click", selectElement, true);

		return () => {
			document.removeEventListener("mouseover", addHoverEffect);
			document.removeEventListener("click", selectElement, true);
		};
	}, []);

	return (
		<div className="absolute w-screen h-screen pointer-events-none active:pointer-events-auto">
			<HoverCanvas hoveredElement={hoveredElement} />
			<div className="relative w-full h-full bg-obsidian-300/50">
				<button onPointerDown={() => changeView(Views.Main)}>
					back
				</button>
			</div>
		</div>
	);
}

export default HoverSelector;