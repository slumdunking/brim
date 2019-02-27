/* @flow */

import {MockBoomClient} from "../test/MockApi"
import {conn} from "../test/mockLogs"
import {fetchPackets} from "./packets"
import {setCurrentSpaceName} from "./spaces"
import initStore from "../test/initStore"

let boom, store
beforeEach(() => {
  boom = new MockBoomClient()
  store = initStore(boom)
})

test("fetching packets is a success", done => {
  boom.stubPromise("packets.get", "file.pcap")
  const packets = jest.spyOn(boom.packets, "get")
  store.dispatch(setCurrentSpaceName("trump-tower"))

  store
    .dispatch(fetchPackets(conn()))
    .then(() => {
      expect(packets).toBeCalledWith(
        expect.objectContaining({
          dst_host: "239.255.255.250",
          dst_port: "1900",
          duration_ns: 293000,
          duration_sec: 2,
          proto: "udp",
          space: "trump-tower",
          src_host: "192.168.0.50",
          src_port: "1900",
          ts_ns: 369843000,
          ts_sec: 1425612054
        })
      )

      expect(store.getActions().map(a => a.type)).toEqual(
        expect.arrayContaining(["PACKETS_REQUEST", "PACKETS_RECEIVE"])
      )

      expect(store.getActions().map(a => a.type)).not.toEqual(
        expect.arrayContaining(["PACKETS_ERROR"])
      )

      done()
    })
    .catch(done)
})

test("fetching packets is a failure", done => {
  boom.stubPromiseError("packets.get", "Boom!")
  const packets = jest.spyOn(boom.packets, "get")
  store.dispatch(setCurrentSpaceName("trump-tower"))

  store
    .dispatch(fetchPackets(conn()))
    .then(() => {
      expect(packets).toBeCalledWith(
        expect.objectContaining({
          dst_host: "239.255.255.250",
          dst_port: "1900",
          duration_ns: 293000,
          duration_sec: 2,
          proto: "udp",
          space: "trump-tower",
          src_host: "192.168.0.50",
          src_port: "1900",
          ts_ns: 369843000,
          ts_sec: 1425612054
        })
      )

      const dispatched = store.getActions().map(a => a.type)
      expect(dispatched).toEqual(
        expect.arrayContaining(["PACKETS_REQUEST", "PACKETS_ERROR"])
      )
      done()
    })
    .catch(done)
})
