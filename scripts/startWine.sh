#!/bin/bash

wine_info() {
    echo "=========================================="
    echo "Command Start Wine 🍷"
    echo "Command: $1"
    echo "Description: run window application or setup wine environment"
    echo "=========================================="
    
}



parse_arguments(){

}


wine_exec(){
    
    if [ -z "$1" ]; then
        wine_info "HELP"
        echo "Usage: wine_exec [info_type] [args...] Appname.exe"
        echo "Example: wine_exec run notepad.exe"
        echo "WINE CONFIG ARGS"
        echo "--wineprefix 'wine_prefix_path'"
        echo "setup wineprefix path(means like bottle) "
        echo "--debug"
        echo "enable debugging features"
        return 1
    fi



    
    
}



# run Wine Exec Function 
wine_exec "$@"