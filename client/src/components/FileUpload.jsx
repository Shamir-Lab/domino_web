import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import ComboSelect from "react-combo-select";
import "react-combo-select/style.css";
import { Spinner } from "@chevtek/react-spinners";
import { spinnerService } from "@chevtek/react-spinners";
import { conf } from "./config.js";

export default class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadStatus: false,
      filename: "",
      parameters: ["gene_expression", "classes", "score", "network"],
      comboValue: "bionet",
      gene_expression_file_name: "",
      score_file_name: "",
      network_file_name: "",
      is_full_report: ""
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);

    // this.socket = openSocket("http://localhost:8000");
    // this.socket.on("connect", () => {
    //   console.log("1");
    // });
    // this.socket.on("disconnect", () => {
    //   console.log("2");
    // });
    // this.socket.on("sync", data => {
    //   console.log("3");
    // });
    // this.socket.on("messages", data => {
    //   console.log("4");
    // });
  }

  combo() {
    let algos = [
      "bionet",
      "hotnet2",
      "netbox",
      "keypathwayminer_ines",
      "keypathwayminer_glone",
      "jactivemodules_greedy",
      "jactivemodules_sa",
      "reactomefi"
    ];

    return (
      <ComboSelect
        className="form-control input-sm"
        data={algos}
        onChange={(value, text) => {
          this.updateAlgo(value, this);
        }}
        value={this.state.comboValue}
      />
    );
  }

  updateAlgo(data, that) {
    console.log(data);
    that.setState({ algo: data });
    that.setState({ comboValue: data });
    return data;
  }

  handleFileChange(that, key, files) {
    let name = "";
    if (files[0] != undefined) name = files[0].name;

    that.setState({ [key]: name });
  }

  rainbow(max, h, s, l) {
    if (Array.isArray(h)) {
      if (h.length > 1) {
        return [10, 10, 10];
      }
      h = h[0];
    }

    h = h / max;

    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

       function bwr(max, h, s, l) {
        if (Array.isArray(h)) {
          if (h.length > 1) {
            return [10, 10, 10];
          }
          h = h[0];
        }
        if (h == undefined) {
          return [10, 10, 10];
        }

        h = h / max;
        console.log(h + " " + max);

        var r, g, b;

        if (s == 0) {
          r = g = b = l; // achromatic
        } else {
          if (h > 0.5) {
            r = 1;
            g = 1 - Math.abs(h - 0.5) / 0.5;
            b = 1 - Math.abs(h - 0.5) / 0.5;
          } else {
            r = h / 0.5;
            g = h / 0.5;
            b = 1;
          }
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }

  handleUploadImage(that) {
    console.log("prepare for uploading...");
    spinnerService.show("mySpinner");
    const data = new FormData();
    let filesContent = [];
    let filesNames = [];

    this.state.parameters.map(cur => {
      data.append(cur + "_file_name", that.state[cur + "_file_name"]);
      data.append(cur + "_file_content", that[cur + "_file_content"].files[0]);
    });
    data.append("algo", that.state["comboValue"]);
    data.append("is_full_report", that.state["is_full_report"]);
    axios
      .post("http://" + conf.IP_ADDRESS + ":8000/upload", data)
      .then(function(response) {
        console.log(
          "successfully uploaded: " + response.data.files_names.join(", ")
        );
        that.setState({ report_link: response.data.report_link });
        let active_nodes_ids = response.data.nodes.map(cur => cur.id);
        let max_score =
          Math.max(
            ...response.data.nodes.map(cur => {
              return cur["score"];
            })
          ) + 1;
        let max_module =
          Math.max(
            ...response.data.nodes
              .map(cur => {
                return cur["modules"];
              })
              .reduce((a, c) => a.concat(c), [])
          ) + 1;
        let new_data = response.data.all_nodes
          .map(cur => {
            if (active_nodes_ids.indexOf(cur.id) == -1) {
              return { data: cur };
            }
          })
          .filter(cur => cur != null)
          .concat(
            response.data.nodes.map(cur => {
              cur["label"] = cur["gene_symbol"];
              cur["node_color"] = that.bwr(
                max_score,
                cur["score"],
                0.5,
                0.5
              );
              cur["line_color"] = that.rainbow(
                max_module,
                cur["modules"],
                0.8,
                0.8
              );
              return { data: cur, selected: true };
            })
          )
          .concat(
            response.data.all_edges.map(cur => {
              if (
                response.data.edges.map(cur2 => cur2.id).indexOf(cur.id) == -1
              )
                return { data: cur };
              else {
                cur["label"] = "-";
                return { data: cur, selected: true };
              }
            })
          );
        console.log(new_data);
        window.io.emit("message", new_data);
        spinnerService.hide("mySpinner");
      })
      .catch(function(error) {
        spinnerService.hide("mySpinner");
        console.log(error);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          {this.state.parameters.map(pr => (
            <React.Fragment key={"0" + pr}>
              <h4 key={"1" + pr}> Choose {pr.split("_").join(" ")} file </h4>
              <div key={"2" + pr} className="custom-file">
                <input
                  key={"3" + pr}
                  className="form-control input-sm custom-file-input"
                  ref={ref => {
                    this[pr + "_file_content"] = ref;
                  }}
                  type="file"
                  onChange={e =>
                    this.handleFileChange(
                      this,
                      pr + "_file_name",
                      e.target.files
                    )
                  }
                />
                <label key={"4" + pr} className="custom-file-label">
                  Choose file...
                </label>
              </div>

              <div key={"5" + pr} className="form-group">
                <input
                  key={"6" + pr}
                  className="form-control"
                  ref={ref => {
                    this.fileName = ref;
                  }}
                  type="text"
                  value={this.state[pr + "_file_name"]}
                  readOnly={true}
                />
              </div>
            </React.Fragment>
          ))}
          <h4>Choose algorithm</h4>
          {this.combo()}
          <div>
            <label>
              <input
                name="is_full_report"
                type="checkbox"
                checked={this.state.is_full_report}
                onChange={e =>
                  this.setState({
                    is_full_report: e.target.checked
                  })
                }
              />
              <h4
                style={{
                  display: "inline-block",
                  "margin-left": "3px"
                }}
              >
                generate full report
              </h4>{" "}
              (may take a while..)
            </label>
          </div>
          <button
            className="btn btn-success m-3"
            onClick={() => {
              this.handleUploadImage(this);
            }}
          >
            Upload
          </button>

          <Spinner name="mySpinner">
            <img
              src="https://i.gifer.com/7plX.gif"
              style={{ height: "20px", width: "20px" }}
            />
          </Spinner>
          <div>
            {this.state.report_link ? (
              <a
                href={"http://" + this.state.report_link}
                style={{}}
                className="btn btn-link"
                role="button"
                target="_blank"
                rel="noopener noreferrer"
              >
                full report
              </a>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
