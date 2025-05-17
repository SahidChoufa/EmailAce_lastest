# To learn more about how to use Nix to configure your environment
# see: https://docs.nixos.org/nixos/
{pkgs}: {
  channel = "stable-24.11";
  packages = [
    pkgs.nodejs_20
  ];
  env = {};
  idx = {
    extensions = [];
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}