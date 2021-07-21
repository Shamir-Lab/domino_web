import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
	ProSidebar,
	SidebarHeader,
	SidebarFooter,
	SidebarContent,
	Menu,
	MenuItem,
	SubMenu,
} from "react-pro-sidebar";
import Tour from "reactour";
import { BsLightning, BsList } from "react-icons/bs";


import "bootstrap/dist/css/bootstrap.css";
import "react-pro-sidebar/dist/css/styles.css";
import "react-combo-select/style.css";

import { ReactComponent as ReactNetworkIcon } from "./resources/network_icon_bright.svg";


const steps = [
	{
		selector: '[data-tour="first-step"]',
		content:
			"Through this navbar you can move between resulting modules. You can find each module under the active gene set from which it was generated.",
		position: "bottom",
	},
	{
		selector: '[data-tour="second-step"]',
		content:
			'This pane show details of the module chosen from the navbar. Here you can see the examine the module as a visulaized graph, see the genes of the module as list (bottom-left table) or overlaid on the network ("show labels on network" button) and GO enrichment analysis (bottom-right table)',
		position: "center",
	},
	{
		selector: '[data-tour="third-step"]',
		content:
			'If you wish to save this analysis, you can download it here. In addition to the modules\' HTML files (located under "module" folder), this functionality also provides GO enrichment analysis and the modules as tsv/txt files (under "go" folder).',
		position: "right",
	},
];

const Modules = (props) => {
	/* Unpack props. */

	console.log(props);
	const geneSets = props.location.state["geneSets"];
	const customFile = props.location.state["customFile"];
	const fileNames = {
		active_genes: props.location.state["Active gene file"],
		network: props.location.state["Network file"],
	};
	const zipURL = props.location.state["zipURL"];

	const [isTourOpen, setIsTourOpen] = useState(true);

	// for testing purposes
	/*
     const customFile = "clusters@dip@1626609835997"; //"Active_genes_file@dip@1626447515852";

     const geneSets = {
        "C1": 2,
        "C2": 3
    };
    const fileNames = {
        "active_genes": "active_genes_file.txt",
        "network": "network_file.txt"
    };
     const zipURL = customFile+".zip";
     */

	/* Initialize component states. */
	// Being on the visualization page, we guarantee that we have modules to display
	let firstSetName;
	for (const setName of Object.keys(geneSets)) {
		if (geneSets[setName] != 0) {
			firstSetName = setName;
			break;
		}
	}
	const [selectedModuleFeatures, setSelectedModuleFeatures] = useState({
		setName: firstSetName,
		moduleNum: 0,
	});
	const [collapse, setCollapse] = useState(false);

	/** Returns true if the button is displaying the corresponding static html. */
	const isActive = (setName, moduleNum) =>
		selectedModuleFeatures.setName === setName &&
		selectedModuleFeatures.moduleNum === moduleNum;

	/** Returns the directory (with respect to the public folder) to the
	 * proper static html file. */
	const moduleDirectory = (setName, moduleNum) =>
		`${customFile}/${setName}/modules/module_${moduleNum}.html`;

	return (
		<>
			<Container style={{ padding: "0" }} fluid>
				<Row style={{ width: "100vw", height: "100vh", margin: "0px" }}>
					<ProSidebar collapsed={collapse}>
						<SidebarHeader>
							<Row>
								{collapse ? (
									<>
										<Col>
											<BsList
												style={{
													height: "25px",
													width: "25px",
													marginLeft: "20%",
													marginTop: "12px",
												}}
												onClick={() =>
													setCollapse(!collapse)
												}
											/>
										</Col>
									</>
								) : (
									<>
										<Col xs={2}>
											<BsList
												style={{
													height: "25px",
													width: "25px",
													marginLeft: "60%",
													marginTop: "12px",
												}}
												onClick={() =>
													setCollapse(!collapse)
												}
											/>
										</Col>
										<Col
											xs={8}
											style={{
												marginTop: "12px",
												fontSize: "15px",
											}}
										>
											DOMINO Web Executor
										</Col>
									</>
								)}
							</Row>
						</SidebarHeader>
						<SidebarContent>
							<Menu iconShape="square">
								<MenuItem>
									<Row>
										{collapse ? (
											<>
												<Col>
													<ReactNetworkIcon
														width="30"
														height="30"
														style={{
															marginLeft: "-1",
														}}
													/>
												</Col>
											</>
										) : (
											<>
												<Col xs={2}>
													<ReactNetworkIcon
														width="30"
														height="30"
														style={{
															marginLeft: "-1",
														}}
													/>
												</Col>
												<Col
													data-tour="first-step"
													xs={8}
												>
													Modules
												</Col>
											</>
										)}
									</Row>
								</MenuItem>
								{Object.keys(geneSets).map((setName) => {
									const numModules = geneSets[setName];
									return (
										<SubMenu title={setName}>
											{collapse ? (
												<div>{setName}</div>
											) : (
												<></>
											)}

											{[...Array(numModules).keys()].map(
												(index) => (
													<MenuItem>
														<a
															onClick={(_) =>
																setSelectedModuleFeatures(
																	{
																		setName:
																			setName,
																		moduleNum:
																			index,
																	}
																)
															}
														>
															module {index}
														</a>
													</MenuItem>
												)
											)}
										</SubMenu>
									);
								})}
							</Menu>
						</SidebarContent>
						<SidebarFooter
							style={{
								height: "160px",
								...(collapse
									? { display: "none" }
									: { margin: "15px" }),
							}}
						>
							<h4>Analysis Parameters</h4>
							<Row>
								<Col>
									<label className="col-form-label">
										{" "}
										Active genes:
									</label>
								</Col>
								<Col>
									<input
										type="text"
										className="form-control"
										value={fileNames.active_genes}
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col>
									<label className="col-form-label">
										Networks:
									</label>
								</Col>
								<Col>
									<input
										type="text"
										className="form-control"
										value={fileNames.network}
										disabled
									/>
								</Col>
							</Row>

							<a
								className="btn btn-primary"
								style={{
									position: "absolute",
									bottom: "10px",
									marginLeft: "20px",
									color: "white",
								}}
								href={zipURL}
								download
								data-tour="third-step"
							>
								Download analysis
							</a>
						</SidebarFooter>
					</ProSidebar>
					<iframe
						style={{ flex: "auto" }}
						data-tour="second-step"
						src={moduleDirectory(
							selectedModuleFeatures.setName,
							selectedModuleFeatures.moduleNum
						)}
					></iframe>
				</Row>
			</Container>
			<Tour
				steps={steps}
				isOpen={isTourOpen}
				onRequestClose={() => setIsTourOpen(false)}
				lastStepNextButton={
					<button
						className="btn btn-primary"
						style={{ width: "150px" }}
					>
						Done! Let's start playing
					</button>
				}
			/>
		</>
	);
};

/*



*/

export default Modules;
