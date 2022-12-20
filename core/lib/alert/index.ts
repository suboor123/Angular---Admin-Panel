import swal from "sweetalert";
import { Confirmation } from "./types";

export class Notify {
  static success(message: string, title: string = "Good job!") {
    swal(title, message, "success");
  }

  static error(message: string, title: string = "Something went wrong") {
    swal(title, message, "error");
  }

  static confirm(args: Confirmation) {
    swal({
      title: args.title || 'Are you sure?',
      text: args.message,
      icon: "warning",
      buttons: [true, true],
      dangerMode: true,
    }).then((hasAccepted) => {
      if (hasAccepted) {
        args.callback();
      }
    });
  }
}
